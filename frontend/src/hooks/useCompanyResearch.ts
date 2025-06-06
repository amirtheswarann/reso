import { useMutation } from '@tanstack/react-query';
import { SSE, SSEOptions, SSEOptionsMethod, CustomEventDataType, CustomEventType } from "sse-ts";
import { OpenAPI } from '@/client/core/OpenAPI';
import { isLoggedIn } from '@/hooks/useAuth';
interface MutationVariables {
  companyName: string;
  insightsRequested: string[];
}

export const useCompanyResearchMutation = ({
  onStatus,
  onDone,
  onError,
}: {
  onStatus: (status: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) => {
  return useMutation<void, Error, MutationVariables>({
    mutationKey: ['companyResearch'],
    mutationFn: async ({ companyName, insightsRequested }) => {
      if (!isLoggedIn()) {
        const errorMsg = "You must be logged in to perform this action.";
        onError(errorMsg);
        throw new Error(errorMsg);
      }

      const token = localStorage.getItem("access_token");
      const payload = {
        company_name: companyName,
        insights_requested: insightsRequested,
      };

      try {
        const res = await fetch(`${OpenAPI.BASE}/api/v1/company_research/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok || !res.body) {
          throw new Error("Failed to connect to the research stream.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          console.log("buffer", buffer);

          // Process complete SSE messages (split by double newlines)
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || ""; // Save incomplete part

          for (const part of parts) {
            const lines = part.trim().split("\n");
            let eventType = "message";
            let data = "";

            for (const line of lines) {
              console.log("line", line);
              if (line.startsWith("event:")) {
                eventType = line.replace("event:", "").trim();
              } else if (line.startsWith("data:")) {
                data += line.replace("data:", "").trim();
              }
            }

            // Dispatch based on event type
            switch (eventType) {
              case "status_update":
                console.log("status_update", data);
                onStatus(data);
                break;
              case "success":
                onStatus(data);
                onDone();
                return;
              default:
                // generic fallback
                onStatus(data);
                break;
            }
          }
        }

        onDone();
      } catch (err) {
        console.error("Stream error:", err);
        onError("Streaming failed. Please try again.");
        throw err;
      }
    },
  });
};
