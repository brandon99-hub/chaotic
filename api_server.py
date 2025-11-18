from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, List
import uvicorn
from zkp_protocol import Server, Client
from hash_utils import reduce_to_field
import os
from pathlib import Path

app = FastAPI(
    title="zkSNARK Authentication API",
    description="Passwordless authentication using Zero-Knowledge Proofs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server_instance = Server()

static_dir = Path("static")
if static_dir.exists():
    app.mount("/static", StaticFiles(directory="static"), name="static")


class RegisterRequest(BaseModel):
    hr_id: str
    Y: str
    g0: str


class LoginRequest(BaseModel):
    hr_id: str
    proof: Dict
    public_signals: List[str]


@app.get("/")
async def root():
    return {
        "message": "zkSNARK Authentication API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "register_g0": "/api/register/g0",
            "register": "/api/register",
            "user_data": "/api/users/{hr_id}/data",
            "login": "/api/login"
        }
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "users_registered": len(server_instance.users)
    }


@app.get("/api/register/g0")
async def get_g0():
    try:
        g0 = server_instance.get_random_g0()
        return {"g0": str(g0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate g0: {str(e)}")


@app.post("/api/register")
async def register_user(request: RegisterRequest):
    try:
        Y = reduce_to_field(int(request.Y))
        g0 = reduce_to_field(int(request.g0))
        
        success, message = server_instance.register_user(
            request.hr_id,
            Y,
            g0
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {
            "success": True,
            "message": message,
            "hr_id": request.hr_id
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.get("/api/users/{hr_id}/data")
async def get_user_data(hr_id: str):
    if hr_id not in server_instance.users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = server_instance.users[hr_id]
    return {
        "g0": str(user_data["g0"]),
        "Y": str(user_data["Y"])
    }


@app.post("/api/login")
async def login_user(request: LoginRequest):
    try:
        success, message = server_instance.authenticate_user(
            request.hr_id,
            request.proof,
            request.public_signals
        )
        
        if not success:
            raise HTTPException(status_code=401, detail=message)
        
        return {
            "success": True,
            "message": message,
            "hr_id": request.hr_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@app.get("/api/users")
async def list_users():
    return {
        "users": list(server_instance.users.keys()),
        "count": len(server_instance.users)
    }


def start_server(host: str = "0.0.0.0", port: int = 8000):
    print("\n" + "=" * 60)
    print("    zkSNARK Authentication API Server")
    print("=" * 60)
    print(f"\nServer starting on http://{host}:{port}")
    print(f"API Documentation: http://{host}:{port}/docs")
    print(f"Health Check: http://{host}:{port}/api/health")
    print("\nPress CTRL+C to stop the server")
    print("=" * 60 + "\n")
    
    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    start_server()

