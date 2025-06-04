import React, { useEffect, useState } from "react"
import {
  Box,
  Container,
  Text,
  Input,
  Button,
  VStack,
  Code,
  Spinner,
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: CompanyResearch,
})

function CompanyResearch() {
  const { user: currentUser } = useAuth()
  const [companyName, setCompanyName] = useState("")
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleStartResearch = async () => {
    setInsights([])
    setLoading(true)

    const eventSource = new EventSource(`/api/company_research_sse?company_name=${encodeURIComponent(companyName)}`, {
      withCredentials: true,
    })

    eventSource.onmessage = (event) => {
      setInsights((prev) => [...prev, event.data])
    }

    eventSource.onerror = (error) => {
      console.error("SSE error", error)
      eventSource.close()
      setLoading(false)
    }

    eventSource.onopen = () => {
      console.log("SSE connection opened")
    }

    eventSource.addEventListener("end", () => {
      eventSource.close()
      setLoading(false)
    })
  }

  return (
    <Container maxW="full">
      <Box pt={12} m={4}>
        <Text fontSize="2xl" truncate maxW="sm">
          Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        <Text>Welcome back, nice to see you again!</Text>
      </Box>

      <VStack gap={4} alignItems="stretch" margin={4}>
        <Input
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button onClick={handleStartResearch} disabled={!companyName || loading}>
          {loading ? <Spinner size="sm" /> : "Start Research"}
        </Button>

        {insights.length > 0 && (
          <Box>
            <Text fontWeight="bold">Streaming Insights:</Text>
            {insights.map((line, idx) => (
              <Code key={idx} display="block" p={2} whiteSpace="pre-wrap">
                {line}
              </Code>
            ))}
          </Box>
        )}
      </VStack>
    </Container>
  )
}

