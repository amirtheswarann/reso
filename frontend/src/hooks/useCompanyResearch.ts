import { useEffect, useState } from "react";
import { companyResearchStream } from "@/client/core/companyResearch";

export const useCompanyResearch = (companyName: string, token: string) => {
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyName || !token) return;

    const eventSource = companyResearchStream(token, companyName);

    eventSource.onmessage = (event) => {
      setData((prev) => [...prev, event.data]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      setError("Streaming failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [companyName, token]);

  return { data, error };
};
