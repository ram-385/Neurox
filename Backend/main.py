from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import Upload
from api.routes import ColumnOps

app = FastAPI()

# CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(Upload.router, prefix="/api")
app.include_router(ColumnOps.router, prefix="/api")
# app.include_router(operations.router, prefix="/api")
# app.include_router(analysis.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Backend is running"}