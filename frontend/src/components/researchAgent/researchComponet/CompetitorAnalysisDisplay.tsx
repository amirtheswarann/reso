import { type CompetitorAnalysis } from "@/client"
import { renderList } from "@/components/ui/list"
import { Box, Heading, Text } from "@chakra-ui/react"

export function competitorAnalysisRenderer(
  key: string,
  comp: CompetitorAnalysis
) {
  return (
    <Box mb={8} key={key}>
      <Heading size="lg" mb={4}>
        Competitor Analysis
      </Heading>
      <Text mb={4}>
        {comp.description ?? "No description available."}
      </Text>

      <Heading size="md" mt={2}>
        Competitors
      </Heading>
      {renderList(comp.competitors)}
    </Box>
  )
}
