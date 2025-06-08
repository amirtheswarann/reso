import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import  generatePDF  from "react-to-pdf";
import {
  Container,
  Heading,
  Text,
  Box,
  List,
  Separator,
  Button,
} from "@chakra-ui/react";

import { CompanyInfo, CompanyResearchService, CompetitorAnalysis, SWOTAnalysis, CompanyResearchResult } from "@/client";

export const Route = createFileRoute("/_layout/h/$id")({
  component: CompanyResearchPage,
});


function CompanyResearchPage() {
  const { id } = Route.useParams();
  const reportRef = useRef();
  const { data, error, isLoading } = useQuery({
    queryKey: ["companyResearch", id],
    queryFn: () => CompanyResearchService.getUserHistoryItem({ historyId: id }),
    enabled: !!id,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading report.</Text>;
  if (!data) return <Text>No data available.</Text>;

  

  const { result } = data;

  function renderList(items?: string[]) {
    if (!items || items.length === 0) return <Text>Unable to find data.</Text>;
    return (
      <List.Root gap={2}>
        {items.map((item, idx) => (
          <List.Item key={idx}>{item}</List.Item>
        ))}
      </List.Root>
    );
  }

  function renderSection(key: string, content: any) {
    switch (key) {
      case "company_info":
        const ci = content as CompanyInfo;
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
        );
      case "swot_analysis":
        const swot = content as SWOTAnalysis;
        return (
          <Box mb={6} key={key}>
            <Heading size="lg" mb={2}>
              SWOT Analysis
            </Heading>

            <Heading size="md" mt={2}>
              Strengths
            </Heading>
            {renderList(swot.strengths)}

            <Heading size="md" mt={4}>
              Weaknesses
            </Heading>
            {renderList(swot.weaknesses)}

            <Heading size="md" mt={4}>
              Opportunities
            </Heading>
            {renderList(swot.opportunities)}

            <Heading size="md" mt={4}>
              Threats
            </Heading>
            {renderList(swot.threats)}
          </Box>
        );
      case "competitor_analysis":
        const comp = content as CompetitorAnalysis;
        return (
          <Box mb={6} key={key}>
            <Heading size="lg" mb={2}>
              Competitor Analysis
            </Heading>
            <Text mb={3}>
              {comp.description ?? "Unable to find data."}
            </Text>

            <Heading size="md" mt={2}>
              Competitors
            </Heading>
            {renderList(comp.competitors)}
          </Box>
        );
      default:
        // ignore unknown keys or add fallback
        return null;
    }
  }

  return (
    <Container maxW="container.md" py={6}>
      <Button mb={4} onClick={() => generatePDF(reportRef, {filename: 'page.pdf'})}>
        Download PDF
      </Button>

      <Box ref={reportRef} bg="white" p={6} borderRadius="md" boxShadow="md">
        <Heading mb={4} size="xl" textAlign="center">
          {data.company_name ?? "Company Research Report"}
        </Heading>

        <Separator mb={4} />

        {/* Dynamically render sections in the order of keys in result */}
        {result &&
            Object.entries(result)
            .filter(([_, content]) => content !== null && content !== undefined)
            .map(([key, content], index, arr) => (
            <div key={key}>
            {renderSection(key, content)}
            {index < arr.length - 1 && <Separator mb={4} />}
            </div>
        ))}


        <Separator />
        <Text fontSize="sm" textAlign="center" mt={4} style={{ color: "#A0AEC0" }}>
          Report generated on: {new Date(data.created_at).toLocaleString()}
        </Text>
      </Box>
    </Container>
  );
}
