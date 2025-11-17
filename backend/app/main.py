from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select

from .database import get_session, init_db
from .models import Campaign, CampaignCreate, Post, PostAnalysis, PostCreate

app = FastAPI(title='AuraLab API', version='0.1.0', openapi_url='/api/v1/openapi.json')
app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_methods=['*'],
  allow_headers=['*'],
)


@app.on_event('startup')
def on_startup():
  init_db()


@app.get('/api/v1/campaigns', response_model=list[Campaign])
def list_campaigns():
  with get_session() as session:
    return session.exec(select(Campaign)).all()


@app.post('/api/v1/campaigns', response_model=Campaign, status_code=201)
def create_campaign(payload: CampaignCreate):
  campaign = Campaign.from_orm(payload)
  with get_session() as session:
    session.add(campaign)
    session.commit()
    session.refresh(campaign)
    return campaign


@app.get('/api/v1/campaigns/{campaign_id}', response_model=Campaign)
def get_campaign(campaign_id: str):
  with get_session() as session:
    campaign = session.get(Campaign, campaign_id)
    if not campaign:
      raise HTTPException(status_code=404, detail='Campaign not found')
    return campaign


@app.get('/api/v1/campaigns/{campaign_id}/posts', response_model=list[Post])
def list_posts(campaign_id: str):
  with get_session() as session:
    statement = select(Post).where(Post.campaign_id == campaign_id).order_by(Post.created_at.desc())
    return session.exec(statement).all()


@app.post('/api/v1/posts', response_model=Post, status_code=201)
def create_post(payload: PostCreate):
  post = Post.from_orm(payload)
  with get_session() as session:
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@app.post('/api/v1/posts/{post_id}/analysis', response_model=Post)
def update_analysis(post_id: str, analysis: PostAnalysis):
  with get_session() as session:
    post = session.get(Post, post_id)
    if not post:
      raise HTTPException(status_code=404, detail='Post not found')
    post.analysis_json = analysis.dict()
    session.add(post)
    session.commit()
    session.refresh(post)
    return post
