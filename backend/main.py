from fastapi import FastAPI
from fastapi_pagination import add_pagination

from starlette.middleware.cors import CORSMiddleware
from starlette_context.middleware import RawContextMiddleware

from backend.routers import company, deal, employee, meeting, note

app = FastAPI(docs_url='/')

for router in [
    company.router,
    deal.router,
    employee.router,
    meeting.router,
    note.router,
]:
    app.include_router(router)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)
app.add_middleware(RawContextMiddleware)
add_pagination(app)
