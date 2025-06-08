import {
  type SWOTAnalysis
} from "@/client"
import { renderList } from "@/components/researchAgent/researchComponet/commonutils"
import {
  Box,
  Heading
} from "@chakra-ui/react"

export function swotAnalysisRenderer(key: string, swot: SWOTAnalysis) {
  return (
    <Box mb={6} key={key}>
      <Heading size="lg" mb={2}>
        SWOT Analysis
      </Heading>

      <Heading size="md" mt={2}>
        Strengths
      </Heading>
      {renderList(swot.strengths)}

      <Heading size="md" mt={4}>
        Weaknesses
      </Heading>
      {renderList(swot.weaknesses)}

      <Heading size="md" mt={4}>
        Opportunities
      </Heading>
      {renderList(swot.opportunities)}

      <Heading size="md" mt={4}>
        Threats
      </Heading>
      {renderList(swot.threats)}
    </Box>
  )
}
