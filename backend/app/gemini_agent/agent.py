from langchain_google_genai import ChatGoogleGenerativeAI

from app.models import CompanyInfo, CompetitorAnalysis, SWOTAnalysis

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    tools=["retrieval"]
)

async def run_swot_analysis(company: str) -> SWOTAnalysis:
    """
    Perform a research-grade SWOT analysis using Gemini's web-connected capabilities.
    """
    prompt = f"""
You are a senior market research analyst. Conduct a **comprehensive and current** SWOT analysis for the company **"{company}"**.

Instructions:
- Use **credible and up-to-date sources** such as news outlets, investor reports, official filings, industry analysis, and expert commentary.
- Each section (Strengths, Weaknesses, Opportunities, Threats) should include **3–5 clearly reasoned bullet points**, ideally backed by data, strategic examples, or competitive context.
- Highlight recent events (past 12–24 months) that support your analysis.
- Avoid generic statements — tailor insights to the company’s **actual strategic situation**.

Format your output as JSON with four top-level keys:
- strengths
- weaknesses
- opportunities
- threats

Each key should map to a list of strings.
"""

    structured_llm = llm.with_structured_output(SWOTAnalysis)
    return await structured_llm.ainvoke(prompt)


async def run_competitor_analysis(company: str) -> CompetitorAnalysis:
    """
    Identify major competitors of a given company and summarize their market positioning.
    """
    prompt = f"""
You are an industry analyst conducting a **deep competitor analysis** for **"{company}"**.

Your task:
1. Identify **3–5 major competitors** operating in the same or adjacent sectors.
2. For each competitor, summarize how it compares to "{company}" across:
   - product strategy
   - innovation and technology
   - market share and growth
   - business model or monetization

Use insights from **recent strategic moves, funding rounds, product launches, or partnerships**.
Rely on current, reputable sources like business news, company reports, or analyst reviews.

Return structured JSON with:
- competitors: List of competitor names (string)
- description: A rich analytical summary (1–3 paragraphs) comparing them with "{company}".
"""

    structured_llm = llm.with_structured_output(CompetitorAnalysis)
    return await structured_llm.ainvoke(prompt)

async def run_company_info_extraction(company: str) -> CompanyInfo:
    """
    Extract key information about a company, including its industry, sector, and notable products or services.
    """
    prompt = f"""
You are a business analyst tasked with gathering accurate, up-to-date information on the company **"{company}"**.

Your task:
1. Identify key company details using trusted, current sources such as investor reports, company websites, Crunchbase, or credible news.
2. Summarize findings across the following categories:
   - Company name (official name)
   - Founding year
   - Founders (full names)
   - Product or service description
   - Funding summary (rounds, investors, total raised)

Guidelines:
- Be factual and avoid speculation.
- Use recent data (2024–2025 if available).
- If any detail cannot be verified, return null for that field.

Return structured output in JSON format with these keys:
- company_name
- founding_year
- founder_names
- product_description
- funding_summary
"""

    structured_llm = llm.with_structured_output(CompanyInfo)
    return await structured_llm.ainvoke(prompt)

