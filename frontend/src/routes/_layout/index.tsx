import { Container } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import CompanyResearchPage from "@/components/researchAgent/companyResearchPage"

export const Route = createFileRoute("/_layout/")({
  component: CompanyResearch,
})

function CompanyResearch() {
  // Removed unused state since CompanyResearchPage handles its own state management
  // const [loading, setLoading] = useState(false) // This state seems unused if CompanyResearchPage handles its own loading

  // The following SSE logic might be redundant if CompanyResearchPage handles its own API calls and SSE.
  // If CompanyResearchPage is self-contained, you can remove this.
  // If this page is meant to *control* CompanyResearchPage, then a props-based or context-based communication
  // would be needed, which is more complex than just displaying it.
  // For now, I'll assume you want to display CompanyResearchPage and let it manage its own state.
  // const handleStartResearch = async () => {
  //   setInsights([])
  //   setLoading(true)

  //   const eventSource = new EventSource(`/api/company_research_sse?company_name=${encodeURIComponent(companyName)}`, {
  //     withCredentials: true,
  //   })

  //   eventSource.onmessage = (event) => {
  //     setInsights((prev) => [...prev, event.data])
  //   }

  //   eventSource.onerror = (error) => {
  //     console.error("SSE error", error)
  //     eventSource.close()
  //     setLoading(false)
  //   }

  //   eventSource.onopen = () => {
  //     console.log("SSE connection opened")
  //   }

  //   eventSource.addEventListener("end", () => {
  //     eventSource.close()
  //     setLoading(false)
  //   })
  // }

  return (
    <Container maxW="full">
      {/* Render the CompanyResearchPage component */}
      <CompanyResearchPage />
    </Container>
  )
}
