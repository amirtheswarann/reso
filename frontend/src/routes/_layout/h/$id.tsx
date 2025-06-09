import {
  CompanyResearchService,
  type CompanyInfo,
  type CompetitorAnalysis,
  type SWOTAnalysis
} from "@/client"
import { companyInfoRenderer } from "@/components/researchAgent/researchComponet/CompanyInfoDisplay"
import { competitorAnalysisRenderer } from "@/components/researchAgent/researchComponet/CompetitorAnalysisDisplay"
import { swotAnalysisRenderer } from "@/components/researchAgent/researchComponet/SWOTAnalysisDisplay"
import { useColorModeValue } from "@/components/ui/color-mode"
import useCustomToast from "@/hooks/useCustomToast"
import { useNavigate } from "@tanstack/react-router"
import {
  Box,
  Container,
  Heading,
  Text,
  VStack
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useRef } from "react"

export const Route = createFileRoute("/_layout/h/$id")({
  component: CompanyResearchPage,
})

function CompanyResearchPage() {
  const { id } = Route.useParams()
  const reportRef = useRef(null)
  const navigate = useNavigate()
  const { showErrorToast } = useCustomToast()
  const { data, error, isLoading } = useQuery({
    queryKey: ["companyResearch", id],
    queryFn: () => CompanyResearchService.getUserHistoryItem({ historyId: id }),
    enabled: !!id,
  })

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  if (isLoading) return <Text textAlign="center">Loading...</Text>
  if (error) {
    showErrorToast("Error loading data. Please try again. ")
    navigate({ to: "/" })
    return <Text textAlign="center">Error loading data.</Text>
  }
  if (!data) return <Text textAlign="center">No data available.</Text>

  const { result } = data

  function renderSection(key: string, content: any) {
    switch (key) {
      case "company_info":
        return companyInfoRenderer(key, content as CompanyInfo)
      case "swot_analysis":
        return swotAnalysisRenderer(key, content as SWOTAnalysis)
      case "competitor_analysis":
        return competitorAnalysisRenderer(key, content as CompetitorAnalysis)
      default:
        return null
    }
  }

  return (
    <Container maxW="5xl" py={10}>
      <Box
        ref={reportRef}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="md"
        p={{ base: 6, md: 10 }}
      >
        <Heading mb={6} size="xl" textAlign="center">
          {data.company_name ?? "Company Research Report"}
        </Heading>

        <VStack gap={2} align="stretch">
          {result &&
            Object.entries(result)
              .filter(([_, content]) => content != null)
              .map(([key, content]) => renderSection(key, content))}
        </VStack>

        {data.created_at && (
          <Text fontSize="sm" textAlign="center" mt={10} color="gray.500">
            Report generated on:{" "}
            {new Date(data.created_at).toLocaleString(undefined, { timeZoneName: "short" })}
          </Text>
        )}
      </Box>
    </Container>
  )
}
