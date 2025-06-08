from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models import SWOTAnalysis, CompetitorAnalysis, CompanyInfo
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro", 
    temperature=0.3,
    tools=["retrieval"]
)

async def run_swot_analysis(company: str) -> SWOTAnalysis:
    """
    Perform a research-grade SWOT analysis using Gemini's web-connected capabilities.
    """
    prompt = f"""
You are an expert market research analyst. Conduct a current SWOT analysis for "{company}".
Use credible, up-to-date sources via live web search.

Structure your findings into:
- Strengths (internal competitive advantages)
- Weaknesses (internal inefficiencies or issues)
- Opportunities (external trends or markets the company can leverage)
- Threats (external forces that may harm the company)

Keep each point concise and insightful.
Return results in structured JSON format with four top-level keys.
"""

    structured_llm = llm.with_structured_output(SWOTAnalysis)
    return await structured_llm.ainvoke(prompt)


async def run_competitor_analysis(company: str) -> CompetitorAnalysis:
    """
    Identify major competitors of a given company and summarize their market positioning.
    """
    prompt = f"""
You are an industry analyst conducting a competitor landscape for "{company}".

Tasks:
1. Identify 3-5 key competitors in the same domain or adjacent markets.
2. Briefly summarize how these competitors compare to "{company}" in terms of:
   - product strategy
   - innovation
   - market share
   - business model

Prioritize reputable and up-to-date insights. Return structured JSON output with:
- competitors: list of competitor names
- description: a concise, analytical comparison summary
"""

    structured_llm = llm.with_structured_output(CompetitorAnalysis)
    return await structured_llm.ainvoke(prompt)

async def run_company_info_extraction(company: str) -> CompanyInfo:
    prompt = f"""
    You are a research assistant tasked with gathering **basic, factual, and up-to-date** information about the company "{company}".

    Using your web search capabilities, please provide the following details in JSON format matching this schema:

    - company_name (string, required): Official full name of the company.
    - founding_year (integer, optional): The year the company was founded.
    - founder_names (list of strings, optional): Names of the founding team members.
    - product_description (string, optional): A concise summary of the company's main products or services.
    - funding_summary (string, optional): An overview of the company's funding history and major investments.

    **Instructions:**
    - Only include information you are confident is accurate.
    - If certain fields are unknown or unavailable, set their value to null or omit them.
    - Format the output strictly as JSON matching the schema.
    - Use recent and reliable sources such as official websites, news outlets, and credible business databases.

    Output example:

    {{
      "company_name": "Example Corp",
      "founding_year": 1999,
      "founder_names": ["Alice Smith", "Bob Johnson"],
      "product_description": "Provides cloud storage solutions for businesses.",
      "funding_summary": "Raised $100 million in Series C funding in 2023."
    }}

    Begin now.
    """

    structured_llm = llm.with_structured_output(CompanyInfo)
    return await structured_llm.ainvoke(prompt)
    
