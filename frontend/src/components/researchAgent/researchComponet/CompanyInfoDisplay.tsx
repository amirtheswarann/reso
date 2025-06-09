import { type CompanyInfo } from "@/client"
import { Box, Heading, Stack, Text } from "@chakra-ui/react"

export function companyInfoRenderer(key: string, ci: CompanyInfo) {
  return (
    <Box mb={8} key={key}>
      <Heading size="lg" mb={4}>
        Company Information
      </Heading>
      <Stack gap={2}>
        <Text>
          <strong>Name:</strong> {ci.company_name ?? "N/A"}
        </Text>
        <Text>
          <strong>Founding Year:</strong> {ci.founding_year ?? "N/A"}
        </Text>
        <Text>
          <strong>Founder Names:</strong>{" "}
          {ci.founder_names?.join(", ") ?? "N/A"}
        </Text>
        <Text>
          <strong>Product Description:</strong>{" "}
          {ci.product_description ?? "N/A"}
        </Text>
        <Text>
          <strong>Funding Summary:</strong>{" "}
          {ci.funding_summary ?? "N/A"}
        </Text>
      </Stack>
    </Box>
  )
}
