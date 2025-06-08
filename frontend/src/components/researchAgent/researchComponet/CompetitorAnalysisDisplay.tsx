import {
  type CompetitorAnalysis
} from "@/client"
import { renderList } from "@/components/researchAgent/researchComponet/commonutils"
import {
  Box,
  Heading,
  Text
} from "@chakra-ui/react"

export function competitorAnalysisRenderer(
  key: string,
  comp: CompetitorAnalysis,
) {
  return (
    <Box mb={6} key={key}>
      <Heading size="lg" mb={2}>
        Competitor Analysis
      </Heading>
      <Text mb={3}>{comp.description ?? "Unable to find data."}</Text>

      <Heading size="md" mt={2}>
        Competitors
      </Heading>
      {renderList(comp.competitors)}
    </Box>
  )
}
