import { type SWOTAnalysis } from "@/client"
import { renderList } from "@/components/researchAgent/researchComponet/commonutils"
import { Box, Heading } from "@chakra-ui/react"

export function swotAnalysisRenderer(key: string, swot: SWOTAnalysis) {
  return (
    <Box mb={8} key={key}>
      <Heading size="lg" mb={4}>
        SWOT Analysis
      </Heading>

      <Heading size="md" mt={4}>
        Strengths
      </Heading>
      {renderList(swot.strengths)}

      <Heading size="md" mt={6}>
        Weaknesses
      </Heading>
      {renderList(swot.weaknesses)}

      <Heading size="md" mt={6}>
        Opportunities
      </Heading>
      {renderList(swot.opportunities)}

      <Heading size="md" mt={6}>
        Threats
      </Heading>
      {renderList(swot.threats)}
    </Box>
  )
}
