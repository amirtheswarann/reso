import { OpenAPI } from "@/client/core/OpenAPI"
import { isLoggedIn } from "@/hooks/useAuth"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { useMutation } from "@tanstack/react-query"

interface MutationVariables {
  companyName: string
  insightsRequested: string[]
}

export const useCompanyResearchMutation = ({
  onStatus,
  onDone,
  onError,
  redirect,
}: {
  onStatus: (status: any) => void
  onDone: () => void
  onError: (error: string) => void
  redirect: (id: string) => void
}) => {
  return useMutation<void, Error, MutationVariables>({
    mutationKey: ["companyResearch"],
    // By default, useMutation has retries disabled, which is correct.
    mutationFn: async ({ companyName, insightsRequested }) => {
      if (!isLoggedIn()) {
        const errorMsg = "You must be logged in to perform this action."
        onError(errorMsg)
        throw new Error(errorMsg)
      }

      const token = localStorage.getItem("access_token")
      const payload = {
        company_name: companyName,
        insights_requested: insightsRequested,
      }

      return new Promise<void>((resolve, reject) => {
        const controller = new AbortController()

        fetchEventSource(`${OpenAPI.BASE}/api/v1/company_research/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          openWhenHidden: true, // Prevent browser tab visibility from killing connection

          async onopen(res) {
            if (res.ok && res.status === 200) {
              console.log("SSE connection opened.")
              return // everything is fine
            }
            const error = new Error(`Failed to connect. Status: ${res.status}`)
            onError(error.message)
            throw error // ⛔ Abort connection + prevent retry
          },

          onmessage(event) {
            if (event.event === "status_update") {
              onStatus(event.data)
              console.log("Stream closed by server.", event.data)
            } else if (event.event === "success") {
              redirect(event.data)
              console.log("Stream closed by server.", event.data)
            } else if (event.event === "done") {
              console.log("Stream is done")
              onDone()
            }
          },

          onclose() {
            console.log("Stream closed by server.")
            onDone()
            resolve()
          },

          onerror(err) {
            console.error("EventSource failed:", err)
            onError(err.message || "Streaming failed. Please try again.")
            reject(err)
            throw err
          },
        })
      })
    },
  })
}
