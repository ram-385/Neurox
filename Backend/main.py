from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import Upload
from api.routes import ColumnOps
from api.routes import FeatureEngineering 
from api.routes import Model

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
app.include_router(FeatureEngineering.router, prefix="/api")
app.include_router(Model.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Backend is running"}