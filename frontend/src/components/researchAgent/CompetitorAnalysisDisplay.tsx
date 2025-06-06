import { Box, Spinner, Text, VStack, Heading, ListItem } from "@chakra-ui/react";
import { UnorderedList } from "@chakra-ui/layout";


interface CompetitorData {
  competitors: string[];
  analysis: string;
}

interface CompetitorAnalysisDisplayProps {
  data: CompetitorData | null;
  isLoading: boolean;
}

export function CompetitorAnalysisDisplay({ data, isLoading }: CompetitorAnalysisDisplayProps) {
  if (isLoading && !data) return <Spinner aria-label="Loading competitor analysis"/>;
  if (!data) return <Text>No competitor analysis available yet. Select "Competitor Analysis" and start research.</Text>;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm" w="full">
      <Heading size="md" mb={3}>Competitor Analysis</Heading>
      <VStack align="start" spacing={3}>
        <Box>
          <Text fontWeight="bold">Key Competitors:</Text>
          <UnorderedList spacing={1} pl={4}>
            {data.competitors.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
          </UnorderedList>
        </Box>
        <Box>
          <Text fontWeight="bold">Analysis Summary:</Text>
          <Text>{data.analysis}</Text>
        </Box>
      </VStack>
    </Box>
  );
}