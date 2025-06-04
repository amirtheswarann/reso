import { Box, Spinner, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export function CompanyInfo({ company }: { company: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["company-info", company],
    queryFn: async () => {
      const res = await axios.post("/api/company_info", { company_name: company })
      return res.data
    },
    enabled: !!company,
  })

  if (isLoading) return <Spinner />
  if (error) return <Text color="red.500">Failed to fetch company info</Text>

  return (
    <Box>
      <Text fontWeight="bold">Company Info:</Text>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  )
}
