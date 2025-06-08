from os import name
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List

from app.api.deps import CurrentUser, SessionDep
from app.models import CompanyResearchHistory, CompanyResearchHistoryResponse, CompanyResearchHistoryBase

router = APIRouter(prefix="/history", tags=["company_research"])

@router.get("/", response_model=List[CompanyResearchHistoryResponse])
def get_user_history(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 1000
):
    """
    Get recent company research history for the current user.
    """
    query = (
        select(CompanyResearchHistory.id, CompanyResearchHistory.company_name, CompanyResearchHistory.created_at)
        .where(CompanyResearchHistory.user_id == current_user.id)
        .order_by(CompanyResearchHistory.created_at.desc())
        .limit(limit)
    )
    results = session.exec(query).all()
    return results

@router.get("/{history_id}", response_model=CompanyResearchHistoryBase)
def get_user_history_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    history_id: UUID
):
    """
    Get a specific company research history item for the current user.
    """
    query = (
        select(CompanyResearchHistory.company_name, CompanyResearchHistory.result, CompanyResearchHistory.created_at)
       .where(CompanyResearchHistory.user_id == current_user.id)
       .where(CompanyResearchHistory.id == history_id)
    )
    result = session.exec(query).first()
    return result



