import { Box, Spinner, Text, Heading, List, ListItem, SimpleGrid } from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface SWOTAnalysisDisplayProps {
  data: SWOTData | null;
  isLoading: boolean;
}

const Section = ({ title, items, icon: Icon, color }: { title: string, items: string[], icon: React.ElementType, color: string }) => (
  <Box>
    <Text fontWeight="bold" mb={1}>{title}:</Text>
    <List.Root gap={1} pl={4}>
      {items.map((item, index) => (
        <ListItem key={index} display="flex" alignItems="center">
          <Box as={Icon} color={color} mr={2} />
          {item}
        </ListItem>
      ))}
    </List.Root>
  </Box>
);


export function SWOTAnalysisDisplay({ data, isLoading }: SWOTAnalysisDisplayProps) {
  if (isLoading && !data) return <Spinner aria-label="Loading SWOT analysis"/>;
  if (!data) return <Text>No SWOT analysis available yet. Select "SWOT Analysis" and start research.</Text>;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm" w="full">
      <Heading size="md" mb={3}>SWOT Analysis</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Section title="Strengths" items={data.strengths} icon={FaCheckCircle} color="green.500" />
        <Section title="Weaknesses" items={data.weaknesses} icon={FaTimesCircle} color="red.500" />
        <Section title="Opportunities" items={data.opportunities} icon={FaLightbulb} color="blue.500" />
        <Section title="Threats" items={data.threats} icon={FaExclamationTriangle} color="orange.500" />
      </SimpleGrid>
    </Box>
  );
}