import {
  Box,
  Button,
  Container,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/_layout/research")({
  component: ResearchPage,
})

function ResearchPage() {
  const [company, setCompany] = useState("")
  const [submittedCompany, setSubmittedCompany] = useState("")

  const handleResearch = () => {
    setSubmittedCompany(company)
  }

  return (
    <Container maxW="3xl" py={6}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Company Research
        </Text>
        <Input
          placeholder="Enter company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleResearch}>
          Research
        </Button>

        {submittedCompany && (
          <>
            <CompanyInfo company={submittedCompany} />
            <CompanyNews company={submittedCompany} />
            <CompanyCompetitors company={submittedCompany} />
          </>
        )}
      </VStack>
    </Container>
  )
}