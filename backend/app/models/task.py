from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

PriorityLevel = Literal["low", "medium", "high"]

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Task title")
    priority: PriorityLevel = Field(default="medium", description="Task priority (low, medium, high)")
    due_date: Optional[str] = Field(default=None, description="Due date formatted as YYYY-MM-DD")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    is_completed: Optional[bool] = Field(default=None)
    priority: Optional[PriorityLevel] = Field(default=None)
    due_date: Optional[str] = Field(default=None)

class TaskResponse(TaskBase):
    id: str
    is_completed: bool = False
    created_at: str

    class Config:
        from_attributes = True
