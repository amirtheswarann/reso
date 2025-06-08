import { useCompanyResearchMutation } from "@/hooks/useCompanyResearch"
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react"
import React, { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import DraggableComponent from "./DraggableComponent"
import { DroppableArea } from "./DroppableArea"
import LoadingOverlay from "./companyResearchLoadingOverlay.tsx"

export const ItemTypes = {
  COMPONENT: "component",
}

export interface DraggableInternalItem {
  id: string
  index: number
  type: string
}

export interface DraggableNewItem {
  id: string
  name: string
  type: string
}

const CompanyResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [droppedItems, setDroppedItems] = useState<
    { id: string; name: string }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("Starting research...")

  const researchMutation = useCompanyResearchMutation({
    onStatus: setStatus,
    onDone: () => setLoading(false),
    onError: (errMsg) => {
      // TODO: Handle error
      setStatus(errMsg)
      setTimeout(() => setLoading(false), 2000)
    },
  })

  // Map draggable component IDs to backend insight keys
  const insightIdMap: Record<string, string> = {
    company_info: "company_info",
    swot_analysis: "swot_analysis",
    competitor_analysis: "competitor_analysis",
  }

  const handleResearch = () => {
    if (!searchTerm || droppedItems.length === 0) return

    setLoading(true)
    setStatus("Initializing research...")

    // Convert dropped items IDs to insights requested by backend
    const insightsRequested = droppedItems
      .map((item) => insightIdMap[item.id])
      .filter(Boolean)
    console.log("data")
    console.log(insightsRequested)

    researchMutation.mutate({
      companyName: searchTerm,
      insightsRequested,
    })
  }

  const handleCancel = () => {
    // TODO: Add actual cancellation if supported by SSE client
    setStatus("Cancelled by user.")
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <>
      {loading && <LoadingOverlay status={status} onCancel={handleCancel} />}

      <DndProvider backend={HTML5Backend}>
        <Flex h="100vh" p={4} gap={4}>
          <Box flex="2" bg="gray.50" p={4} rounded="md">
            <VStack align="stretch" gap={4}>
              <Input
                placeholder="Enter the company name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <Button
                onClick={handleResearch}
                disabled={loading || !searchTerm || droppedItems.length === 0}
              >
                Research
              </Button>
              <DroppableArea
                droppedItems={droppedItems}
                setDroppedItems={setDroppedItems}
              />
            </VStack>
          </Box>

          <Box flex="1" bg="white" p={4} rounded="md" shadow="md">
            <Text mb={2} fontWeight="bold">
              Research insights:
            </Text>
            <DraggableComponent
              id="company_info"
              name="Company Overview"
              description="Get detailed information about company funding rounds, valuation, and key business metrics"
            />
            <DraggableComponent
              id="swot_analysis"
              name="SWOT Analysis"
              description="Comprehensive analysis of company's Strengths, Weaknesses, Opportunities and Threats"
            />
            <DraggableComponent
              id="competitor_analysis"
              name="Competitor Analysis"
              description="In-depth analysis of main competitors, market positioning and competitive advantages"
            />
          </Box>
        </Flex>
      </DndProvider>
    </>
  )
}

export default CompanyResearchPage
