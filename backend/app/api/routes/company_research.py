from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from app.api.deps import CurrentUser
from typing import AsyncGenerator, Any
import asyncio
import json
import logging
from app.models import CompanyResearchRequest
from app.agent.helper import COMPANY_INFO_EXTRACTION_SCHEMA
from aiostream import stream
from app.models import AStreamStatus, AStreamResult
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/company_research", tags=["agents"])


import asyncio
from app.agent.graph import graph as company_research_graph

async def company_info_extation():
    graph_input_data = {
        "company": "Tesla",
        "extraction_schema": COMPANY_INFO_EXTRACTION_SCHEMA,
        "user_notes": ""
    }

    async for step in company_research_graph.astream(input=graph_input_data):
        yield AStreamStatus(type="status", data=json.dumps(step)) 

    graph_output: dict = await company_research_graph.ainvoke(
        input=graph_input_data,
        config=None
    )
    yield AStreamResult(type="output", data=json.dumps(graph_output), insight="company_info")

async def none():
    yield AStreamStatus(type="status", data="None")

async def stream_company_research(company_name: str, insights_requested: list[str]) -> AsyncGenerator[str, None]:
    company_research_data = {}
    insight_func = {
        "company_info": company_info_extation,
        "swot_analysis": none,
        "competitor_analysis": none
    }
    logger.info(f"got the issue {company_name} {insights_requested }")

    async for step in stream.merge(*[insight_func[insight]() for insight in insights_requested]):
        if step.type == "status":
            yield f"event: status_update\ndata: {json.dumps(step.data)}\n\n"
        elif step.type == "output":
            company_research_data[step.insight] = step.data

    yield f"event: success\ndata: {json.dumps(company_research_data)}\n\n"

@router.post("/", response_model=None)
async def company_research(
    *,
    current_user: CurrentUser,
    request_data: CompanyResearchRequest
) -> Any:
    """
    Stream company research insights as SSE based on the requested insight types.
    """
    if not request_data.company_name:
        raise HTTPException(status_code=400, detail="Missing 'company_name'")
    if not request_data.insights_requested:
        raise HTTPException(status_code=400, detail="'insights_requested' is required")

    # Optionally validate allowed values here
    allowed_insights = {"company_info", "swot_analysis", "competitor_analysis"}
    if invalid := [i for i in request_data.insights_requested if i not in allowed_insights]:
        raise HTTPException(status_code=400, detail=f"Invalid insight types: {', '.join(invalid)}")

    return EventSourceResponse(
        stream_company_research(request_data.company_name, request_data.insights_requested)
    )
