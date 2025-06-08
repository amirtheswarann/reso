import {
  type CompanyInfo
} from "@/client"
import { Box, Heading, Text } from "@chakra-ui/react"

export function companyInfoRenderer(key: string, ci: CompanyInfo) {
  return (
    <Box mb={6} key={key}>
      <Heading size="lg" mb={2}>
        Company Information
      </Heading>
      <Text>
        <strong>Name:</strong> {ci.company_name ?? "Unable to find data."}
      </Text>
      <Text>
        <strong>Founding Year:</strong>{" "}
        {ci.founding_year ?? "Unable to find data."}
      </Text>
      <Text>
        <strong>Founder Names:</strong>{" "}
        {ci.founder_names?.join(", ") ?? "Unable to find data."}
      </Text>
      <Text>
        <strong>Product Description:</strong>{" "}
        {ci.product_description ?? "Unable to find data."}
      </Text>
      <Text>
        <strong>Funding Summary:</strong>{" "}
        {ci.funding_summary ?? "Unable to find data."}
      </Text>
    </Box>
  )
}
