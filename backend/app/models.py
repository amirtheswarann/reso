import uuid
from pydantic import EmailStr, field_serializer
from sqlmodel import Field, Relationship, SQLModel, DateTime
from datetime import datetime
from typing import Optional, List
from sqlalchemy import JSON, Column

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    research_history: list["CompanyResearchHistory"] = Relationship(
        back_populates="user", cascade_delete=True
    )



# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str

class CompanyResearchRequest(SQLModel):
    company_name: str = Field(min_length=1, max_length=255)
    insights_requested: list[str]


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class SWOTAnalysis(SQLModel):
    strengths: List[str] = Field(description="Internal advantages that give the company a competitive edge.")
    weaknesses: List[str] = Field(description="Internal limitations or challenges faced by the company.")
    opportunities: List[str] = Field(description="External trends or areas the company can leverage for growth.")
    threats: List[str] = Field(description="External risks or challenges that could impact the company negatively.")

class CompetitorAnalysis(SQLModel):
    competitors: List[str] = Field(description="Direct or emerging competitors in the same market space.")
    description: str = Field(description="Concise comparative summary highlighting market positioning, strategic differences, or innovation.")

class CompanyInfo(SQLModel):
    company_name: str = Field(..., description="Official name of the company")
    founding_year: Optional[int] = Field(None, description="Year the company was founded")
    founder_names: Optional[List[str]] = Field(None, description="Names of the founding team members")
    product_description: Optional[str] = Field(None, description="Brief description of the company's main product or service")
    funding_summary: Optional[str] = Field(None, description="Summary of the company's funding history")

class CompanyResearch(SQLModel):
    company: str

class AStreamStatus(SQLModel):
    type: str
    data: dict | str

class AStreamResult(AStreamStatus):
    insight: str

# models.py
class CompanyResearchHistoryResponse(SQLModel):
    id: uuid.UUID
    company_name: str
    created_at: datetime

class CompanyResearchResult(SQLModel):
    company_info: Optional[CompanyInfo] = None
    swot_analysis: Optional[SWOTAnalysis] = None
    competitor_analysis: Optional[CompetitorAnalysis] = None

class CompanyResearchHistoryBase(SQLModel):
    company_name: str = Field(min_length=1, max_length=255)
    result: Optional[CompanyResearchResult] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(), sa_column=Column(DateTime(timezone=True),nullable=False))

    @field_serializer("created_at")
    def serialize_created_at(self, value: datetime):
        return value.astimezone().isoformat()

class CompanyResearchHistory(CompanyResearchHistoryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, index=True)

    user: "User" = Relationship(back_populates="research_history")
