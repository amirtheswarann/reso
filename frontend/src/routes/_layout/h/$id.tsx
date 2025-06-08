import {
  CompanyResearchService,
  type CompanyInfo,
  type CompetitorAnalysis,
  type SWOTAnalysis
} from "@/client"
import { companyInfoRenderer } from "@/components/researchAgent/researchComponet/CompanyInfoDisplay"
import { competitorAnalysisRenderer } from "@/components/researchAgent/researchComponet/CompetitorAnalysisDisplay"
import { swotAnalysisRenderer } from "@/components/researchAgent/researchComponet/SWOTAnalysisDisplay"
import {
  Box,
  Container,
  Heading,
  Separator,
  Text
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useRef } from "react"

export const Route = createFileRoute("/_layout/h/$id")({
  component: CompanyResearchPage,
})

function CompanyResearchPage() {
  const { id } = Route.useParams()
  const reportRef = useRef()
  const { data, error, isLoading } = useQuery({
    queryKey: ["companyResearch", id],
    queryFn: () => CompanyResearchService.getUserHistoryItem({ historyId: id }),
    enabled: !!id,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading report.</Text>
  if (!data) return <Text>No data available.</Text>

  const { result } = data

  function renderSection(key: string, content: any) {
    switch (key) {
      case "company_info": {
        const ci = content as CompanyInfo
        return companyInfoRenderer(key, ci)
      }
      case "swot_analysis": {
        const swot = content as SWOTAnalysis
        return swotAnalysisRenderer(key, swot)
      }
      case "competitor_analysis": {
        const comp = content as CompetitorAnalysis
        return competitorAnalysisRenderer(key, comp)
      }
      default:
        // ignore unknown keys or add fallback
        return null
    }
  }

  return (
    <Container maxW="container.md" py={6}>
      {/* <Button mb={4} onClick={() => generatePDF(reportRef, {filename: 'page.pdf'})}>
        Download PDF
      </Button> */}

      <Box ref={reportRef} bg="white" p={6} borderRadius="md" boxShadow="md">
        <Heading mb={4} size="xl" textAlign="center">
          {data.company_name ?? "Company Research Report"}
        </Heading>

        <Separator mb={4} />

        {/* Dynamically render sections in the order of keys in result */}
        {result &&
          Object.entries(result)
            .filter(([_, content]) => content !== null && content !== undefined)
            .map(([key, content], index, arr) => (
              <div key={key}>
                {renderSection(key, content)}
                {index < arr.length - 1 && <Separator mb={4} />}
              </div>
            ))}

        <Separator />
        {data.created_at && (
          <Text fontSize="sm" textAlign="center" mt={4} color="gray.500">
            Report generated on: {new Date(data.created_at).toLocaleString()}
          </Text>
        )}
      </Box>
    </Container>
  )
}
