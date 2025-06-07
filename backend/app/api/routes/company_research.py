# FILE: app/api/routes/company_research.py

from fastapi import APIRouter, HTTPException
from sse_starlette import EventSourceResponse, ServerSentEvent
from typing import AsyncGenerator, Any
import logging
import json
from aiostream import stream

# --- Application-specific imports ---
# (Assuming these paths are correct for your project structure)
from app.api.deps import CurrentUser
from app.models import CompanyResearchRequest, AStreamStatus, AStreamResult
from app.agent.graph import graph as company_research_graph
from app.agent.helper import COMPANY_INFO_EXTRACTION_SCHEMA

# --- Setup ---
router = APIRouter(prefix="/company_research", tags=["agents"])
logger = logging.getLogger(__name__)

# --- Configuration: Map internal node names to user-friendly display names ---
NODE_DISPLAY_NAMES = {
    "generate_queries": "Generating Search Queries...",
    "research_company": "Searching Online for Information...",
    "gather_notes_extract_schema": "Structuring Research Data...",
    "reflection": "Analyzing Research Quality...",
    "__end__": "Finalizing Report"  # Special node name for the end of the graph
}

# --- Insight Generator Functions ---

async def company_info_extation() -> AsyncGenerator[Any, None]:
    """
    Streams the progress of the main company research graph.
    Transforms internal node names into user-friendly display names.
    """
    graph_input_data = {
        "company": "Tesla",  # This would ideally come from the request
        "extraction_schema": COMPANY_INFO_EXTRACTION_SCHEMA,
        "user_notes": ""
    }

    # Stream through each step of the LangGraph execution
    async for step in company_research_graph.astream(input=graph_input_data):
        # Extract the internal node name (it's the only key in the `step` dict)
        internal_node_name = list(step.keys())[0]

        # Look up the user-friendly name from our map
        display_name = NODE_DISPLAY_NAMES.get(internal_node_name, internal_node_name)

        # Yield a status update containing only the display name string
        yield AStreamStatus(type="status", data=display_name)

    # After the stream is done, get the final result
    graph_output: dict = await company_research_graph.ainvoke(input=graph_input_data, config=None)

    # Yield the final result for this insight
    yield AStreamResult(type="output", data=graph_output, insight="company_info")


async def swot_analysis() -> AsyncGenerator[Any, None]:
    """Dummy streamer for SWOT analysis."""
    yield AStreamStatus(type="status", data="SWOT Analysis is not yet implemented.")


async def competitor_analysis() -> AsyncGenerator[Any, None]:
    """Dummy streamer for Competitor analysis."""
    yield AStreamStatus(type="status", data="Competitor Analysis is not yet implemented.")


# --- Main SSE Streaming Logic ---

async def stream_company_research(
    company_name: str,
    insights_requested: list[str]
) -> AsyncGenerator[ServerSentEvent, None]:
    """
    Merges multiple insight streams and yields Server-Sent Events.
    """
    company_research_data = {}

    insight_func_map = {
        "company_info": company_info_extation,
        "swot_analysis": swot_analysis,
        "competitor_analysis": competitor_analysis,
    }

    logger.info(f"Starting research stream for: {company_name}, insights: {insights_requested}")

    # Use 'async with' to correctly manage the aiostream context and prevent warnings
    async with stream.merge(*[insight_func_map[insight]() for insight in insights_requested]).stream() as streamer:
        async for step in streamer:
            if step.type == "status":
                # For status updates, send the data payload (which is just a string now)
                # We use json.dumps to ensure it's a valid JSON string (e.g., "My String")
                yield ServerSentEvent(data=step.data, event="status_update")
            
            elif step.type == "output":
                # When an insight is complete, store its final data
                company_research_data[step.insight] = step.data

    # After all streams are complete, send the final consolidated result
    if company_research_data:
        yield ServerSentEvent(data=company_research_data, event="success")


# --- FastAPI Route ---

@router.post("/", response_model=None)
async def company_research(
    *,
    current_user: CurrentUser, # Assuming authentication dependency
    request_data: CompanyResearchRequest
) -> EventSourceResponse:
    """
    Streams company research insights as Server-Sent Events (SSE) based on
    the requested insight types.
    """
    company_name = request_data.company_name
    insights = request_data.insights_requested

    if not company_name:
        raise HTTPException(status_code=400, detail="Missing 'company_name'")

    if not insights:
        raise HTTPException(status_code=400, detail="'insights_requested' is required")

    # Validate that the requested insights are valid
    allowed_insights = {"company_info", "swot_analysis", "competitor_analysis"}
    if invalid_insights := [i for i in insights if i not in allowed_insights]:
        raise HTTPException(status_code=400, detail=f"Invalid insight types: {', '.join(invalid_insights)}")

    # Create and return the streaming response
    return EventSourceResponse(
        stream_company_research(company_name, insights)
    )