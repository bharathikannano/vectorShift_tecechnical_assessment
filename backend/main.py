from collections import deque
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class PipelineRequest(BaseModel):
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_directed_acyclic_graph(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> bool:
    node_ids = {node.get('id') for node in nodes if node.get('id')}
    adjacency = {node_id: [] for node_id in node_ids}
    indegree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')

        if source not in node_ids or target not in node_ids:
            continue

        adjacency[source].append(target)
        indegree[target] += 1

    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    visited_count = 0

    while queue:
        node_id = queue.popleft()
        visited_count += 1

        for neighbor in adjacency[node_id]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineRequest):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_directed_acyclic_graph(pipeline.nodes, pipeline.edges),
    }
