from fastapi import APIRouter, HTTPException, Request
from sse_starlette.sse import EventSourceResponse
from app.api.deps import CurrentUser
from app.agent.company_research import stream_company_research
from app.models import ResearchInsight


router = APIRouter(prefix="/company_reseaarch", tags=["agents"])

@router.post("/")
async def company_research(
    request: Request, current_user: CurrentUser, company_name: str
) -> ResearchInsight:

    if not company_name:
        raise HTTPException(status_code=400, detail="Missing 'company_name' in request")

    return EventSourceResponse(stream_company_research(company_name))
