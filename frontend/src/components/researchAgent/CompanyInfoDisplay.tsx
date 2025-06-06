import { Box, Spinner, Text, VStack, Heading } from "@chakra-ui/react";

interface CompanyInfoData {
  name: string;
  founded: string;
  ceo: string;
  industry?: string;
}

interface CompanyInfoDisplayProps {
  data: CompanyInfoData | null;
  isLoading: boolean;
}

export function CompanyInfoDisplay({ data, isLoading }: CompanyInfoDisplayProps) {
  if (isLoading && !data) return <Spinner aria-label="Loading company information" />;
  if (!data) return <Text>No company information available yet. Select "Company Information" and start research.</Text>;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm" w="full">
      <Heading size="md" mb={3}>Company Information</Heading>
      <VStack alignItems="start" gap={1}>
        <Text><strong>Name:</strong> {data.name}</Text>
        <Text><strong>Founded:</strong> {data.founded}</Text>
        <Text><strong>CEO:</strong> {data.ceo}</Text>
        {data.industry && <Text><strong>Industry:</strong> {data.industry}</Text>}
      </VStack>
    </Box>
  );
}