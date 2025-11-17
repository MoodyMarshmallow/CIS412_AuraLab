from __future__ import annotations

from contextlib import contextmanager
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

DB_PATH = Path(__file__).resolve().parent.parent / 'auralab.db'
engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)


def init_db() -> None:
  SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
  with Session(engine) as session:
    yield session
