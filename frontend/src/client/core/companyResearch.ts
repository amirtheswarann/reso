export const companyResearchStream = (token: string, companyName: string): EventSource => {
    const url = `${import.meta.env.VITE_API_URL}/company_research`;
  
    const eventSource = new EventSource(url, {
      withCredentials: true,
    });
  
    const controller = new AbortController();
  
    // Workaround: Send auth headers via a POST + token fallback through a secure setup
    fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_name: companyName }),
      signal: controller.signal,
    }).catch((err) => {
      console.error("Failed to send request to SSE endpoint", err);
    });
  
    return eventSource;
  };
  