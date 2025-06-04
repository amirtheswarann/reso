import React from "react";
import useAuth from "../../hooks/useAuth";
import { useCompanyResearch } from "../../hooks/useCompanyResearch";

export const CompanyResearch = () => {
  const { user } = useAuth(); // Get user from auth logic
  const token = user?.access_token; // Extract token from user object
  const companyName = "OpenAI"; // Replace with input or state
  const { data, error } = useCompanyResearch(companyName, token);

  return (
    <div className="company-research">
      <h2>Researching: {companyName}</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {data.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
};
