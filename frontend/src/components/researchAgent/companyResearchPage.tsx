import { useColorModeValue } from "@/components/ui/color-mode"
import useAuth from "@/hooks/useAuth"
import { useCompanyResearchMutation } from "@/hooks/useCompanyResearch"
import {
  Box,
  Button,
  Flex,
  Group,
  Heading,
  Input,
  VStack
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DroppableArea } from "./researchComponet/DroppableArea"
import LoadingOverlay from "./researchComponet/companyResearchLoadingOverlay"
import DraggableComponent from "./researchComponet/draggableComponent"


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
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [droppedItems, setDroppedItems] = useState<{
    id: string
    name: string
  }[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("Starting research...")

  const researchMutation = useCompanyResearchMutation({
    onStatus: setStatus,
    onDone: () => setLoading(false),
    onError: (errMsg) => {
      setStatus(errMsg)
      setTimeout(() => setLoading(false), 2000)
    },
    redirect: (id) => {
      queryClient.invalidateQueries({
        queryKey: ["userHistory", currentUser?.id],
      })
      navigate({ to: `/h/${id}` })
    },
  })

  const insightIdMap: Record<string, string> = {
    company_info: "company_info",
    swot_analysis: "swot_analysis",
    competitor_analysis: "competitor_analysis",
  }

  const handleResearch = () => {
    if (!searchTerm || droppedItems.length === 0) return

    setLoading(true)
    setStatus("Initializing research...")

    const insightsRequested = droppedItems
      .map((item) => insightIdMap[item.id])
      .filter(Boolean)

    researchMutation.mutate({
      companyName: searchTerm,
      insightsRequested,
    })
  }

  const handleCancel = () => {
    setStatus("Cancelled by user.")
    setTimeout(() => setLoading(false), 1000)
  }

  const panelBg = useColorModeValue("white", "gray.800")
  const inputBg = useColorModeValue("gray.50", "gray.700")

  return (
    <>
      {loading && <LoadingOverlay status={status} onCancel={handleCancel} />}

      <DndProvider backend={HTML5Backend}>
        <Flex direction={{ base: "column", md: "row" }} h="100vh" p={4} gap={6}>
          {/* Left Panel: Input & Droppable Area */}
          <Box
            flex={{ base: "none", md: 2 }}
            bg={panelBg}
            p={6}
            rounded="2xl"
            shadow="base"
            display="flex"
            flexDirection="column"
            gap={6}
          >
            <Heading size="lg">Company Research</Heading>
            <Group>
              <Input
                placeholder="Enter a company name"
                bg={inputBg}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                size="lg"
                rounded="lg"
              />
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleResearch}
                disabled={loading || !searchTerm || droppedItems.length === 0}
                rounded="lg"
              >
                Research
              </Button>
            </Group>
            <DroppableArea
              droppedItems={droppedItems}
              setDroppedItems={setDroppedItems}
            />
          </Box>

          {/* Right Panel: Insights */}
          <Box
            flex={{ base: "none", md: 1 }}
            bg={panelBg}
            p={6}
            rounded="2xl"
            shadow="base"
            overflowY="auto"
            h={{ base: "auto", md: "full" }}
          >
            <Heading size="md" mb={4}>
              Available Insights
            </Heading>
            <VStack align="stretch" gap={4}>
              <DraggableComponent
                id="company_info"
                name="Company Overview"
                description="Details about funding, valuation, and metrics."
              />
              <DraggableComponent
                id="swot_analysis"
                name="SWOT Analysis"
                description="Strengths, Weaknesses, Opportunities & Threats."
              />
              <DraggableComponent
                id="competitor_analysis"
                name="Competitor Analysis"
                description="Market positioning and competitive edge."
              />
            </VStack>
          </Box>
        </Flex>
      </DndProvider>
    </>
  )
}

export default CompanyResearchPage
