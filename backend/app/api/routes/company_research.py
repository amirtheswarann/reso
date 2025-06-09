import logging
from collections.abc import AsyncGenerator
from typing import Any

from aiostream import stream
from fastapi import APIRouter, HTTPException
from sse_starlette import EventSourceResponse, ServerSentEvent

from app.agent.graph import graph as company_research_graph
from app.agent.helper import COMPANY_INFO_EXTRACTION_SCHEMA, NODE_DISPLAY_NAMES

# --- Application-specific imports ---
# (Assuming these paths are correct for your project structure)
from app.api.deps import CurrentUser, SessionDep
from app.core import config
from app.gemini_agent.agent import (
    run_company_info_extraction,
    run_competitor_analysis,
    run_swot_analysis,
)
from app.models import (
    AStreamResult,
    AStreamStatus,
    CompanyResearchHistory,
    CompanyResearchRequest,
)

# --- Setup ---
router = APIRouter(prefix="/company_research", tags=["agents"])
logger = logging.getLogger(__name__)

async def company_info_extation(company_name: str) -> AsyncGenerator[Any, None]:
    """
    Streams the progress of the main company research graph.
    Transforms internal node names into user-friendly display names.
    """
    if config.settings.AGENT_VERSION == "v2":
        yield AStreamStatus(type="status", data="Initiating Company Info Extraction")
        data = await run_company_info_extraction(company_name)
        yield AStreamResult(type="output", data=data.__dict__, insight="company_info")
        yield AStreamStatus(type="status", data="Company Info Analysis Complete")
    else:
        graph_input_data = {
            "company": company_name,  # This would ideally come from the request
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
        yield AStreamStatus(type="status", data="Company Info Analysis Complete")


async def swot_analysis(company_name: str) -> AsyncGenerator[Any, None]:
    """Dummy streamer for SWOT analysis."""
    yield AStreamStatus(type="status", data="Initiating SWOT Analysis")
    data = await run_swot_analysis(company_name)
    data = data.__dict__
    yield AStreamResult(type="output", data=data, insight="swot_analysis")
    yield AStreamStatus(type="status", data="SWOT Analysis Complete")


async def competitor_analysis(company_name: str) -> AsyncGenerator[Any, None]:
    yield AStreamStatus(type="status", data="Initiating Competitor Analysis")
    data = await run_competitor_analysis(company_name)
    data = data.__dict__
    yield AStreamResult(type="output", data=data, insight="competitor_analysis")
    yield AStreamStatus(type="status", data="Competitor Analysis Complete")


async def stream_company_research(
    company_name: str,
    insights_requested: list[str],
    session: SessionDep,
    current_user: CurrentUser
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

    async with stream.merge(*[insight_func_map[insight](company_name) for insight in insights_requested]).stream() as streamer:
        async for step in streamer:
            if step.type == "status":
                yield ServerSentEvent(data=step.data, event="status_update")

            elif step.type == "output":
                company_research_data[step.insight] = step.data

    if company_research_data:
        company_research_history = CompanyResearchHistory(
            company_name=company_name,
            result=company_research_data,
            user_id=current_user.id,
        )
        session.add(company_research_history)
        session.commit()
        session.refresh(company_research_history)
        yield ServerSentEvent(data=str(company_research_history.id), event="success")

@router.post("/", response_model=None)
async def company_research(
    *, session: SessionDep, current_user: CurrentUser, request_data: CompanyResearchRequest
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

    allowed_insights = {"company_info", "swot_analysis", "competitor_analysis"}
    if invalid_insights := [i for i in insights if i not in allowed_insights]:
        raise HTTPException(status_code=400, detail=f"Invalid insight types: {', '.join(invalid_insights)}")

    return EventSourceResponse(
        stream_company_research(company_name, insights, session, current_user)
    )
