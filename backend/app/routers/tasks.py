from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.database import get_supabase_client

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskResponse])
def get_tasks():
    """
    Fetch all tasks ordered by created_at descending.
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("tasks").select("*").order("created_at", desc=True).execute()
        return response.data
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database query failed: {str(e)}")

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate):
    """
    Create a new task with given title, priority, and optional due_date.
    """
    try:
        supabase = get_supabase_client()
        data = {
            "title": task_in.title.strip(),
            "priority": task_in.priority,
            "due_date": task_in.due_date,
            "is_completed": False,
        }
        response = supabase.table("tasks").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to insert task.")
        return response.data[0]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Insert failed: {str(e)}")

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, updates: TaskUpdate):
    """
    Update fields of an existing task (e.g. toggle is_completed, update title, priority, due_date).
    """
    try:
        supabase = get_supabase_client()
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update.")
        
        response = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id '{task_id}' not found.")
        return response.data[0]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Update failed: {str(e)}")

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    """
    Delete a task permanently by task_id.
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("tasks").delete().eq("id", task_id).execute()
        if not response.data:
            # Check if task existed or was already deleted
            pass
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Delete failed: {str(e)}")
