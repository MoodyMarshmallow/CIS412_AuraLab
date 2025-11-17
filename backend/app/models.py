from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from sqlmodel import Column, DateTime, Field, SQLModel


class CampaignBase(SQLModel):
  title: str
  prompt: str
  audience: Optional[str] = None
  guidelines: Optional[str] = None
  reference_paths: List[str] = Field(default_factory=list, sa_column_kwargs={'nullable': False})


class Campaign(CampaignBase, table=True):
  id: UUID = Field(default_factory=uuid4, primary_key=True)
  created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class CampaignCreate(CampaignBase):
  pass


class PostBase(SQLModel):
  campaign_id: UUID
  title: str
  text: str
  media_paths: List[str] = Field(default_factory=list, sa_column_kwargs={'nullable': False})
  status: str = Field(default='DRAFT', regex='^(DRAFT|READY)$')
  analysis_json: Optional[dict] = None


class Post(PostBase, table=True):
  id: UUID = Field(default_factory=uuid4, primary_key=True)
  created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), nullable=False))


class PostCreate(PostBase):
  pass


class PostAnalysis(SQLModel):
  summary: str
  improvements: List[str]
  media_notes: Optional[str] = None
