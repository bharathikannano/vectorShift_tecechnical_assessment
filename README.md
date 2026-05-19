# VectorShift Frontend Technical Assessment

A React Flow pipeline builder with a FastAPI backend. Users can drag nodes onto a
canvas, edit node fields, connect handles, submit the graph, and receive an alert
with node count, edge count, and DAG status.

## What Is Included

- Reusable node abstraction with shared layout, handles, fields, and styling.
- Original nodes: Input, LLM, Output, Text.
- Five additional demo nodes: API, Transform, Condition, Delay, Logger.
- Unified frontend styling for toolbar, canvas, nodes, controls, and submit flow.
- Text node auto-resizing based on entered content.
- Text node variable parsing for valid JavaScript identifiers like `{{ input }}`.
- Frontend-to-backend submit integration.
- Backend DAG validation and graph summary response.

## Project Structure

```text
.
├── backend/
│   └── main.py
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── baseNode.js
│   │   │   ├── genericNode.js
│   │   │   ├── registry.js
│   │   │   ├── inputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── outputNode.js
│   │   │   └── textNode.js
│   │   ├── App.js
│   │   ├── draggableNode.js
│   │   ├── index.css
│   │   ├── store.js
│   │   ├── submit.js
│   │   ├── toolbar.js
│   │   └── ui.js
│   ├── package-lock.json
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- Python 3.9+

## Install

From the repository root, install frontend dependencies:

```bash
cd frontend
npm ci
```

If `npm ci` is not available for your environment, use:

```bash
npm install
```

Set up the backend virtual environment:

```bash
cd ../backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
```

## Run

Start the backend from `backend/`:

```bash
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

The backend should run at:

```text
http://localhost:8000
```

In a second terminal, start the frontend from `frontend/`:

```bash
npm start
```

The frontend should run at:

```text
http://localhost:3000
```

If port `3000` is already busy, run the frontend on another allowed port:

```bash
PORT=3001 npm start
```

The backend CORS settings already allow `localhost:3000` and `localhost:3001`.

## Validate

### 1. Frontend Build

From `frontend/`:

```bash
npm run build
```

Expected result:

```text
Compiled successfully.
```

### 2. Backend Syntax

From `backend/`:

```bash
source venv/bin/activate
python -m py_compile main.py
```

Expected result: no output and exit code `0`.

### 3. Backend Parse Endpoint

Start the backend first, then run this acyclic graph test:

```bash
curl -s -X POST http://127.0.0.1:8000/pipelines/parse \
  -H 'Content-Type: application/json' \
  -d '{"nodes":[{"id":"input-1"},{"id":"text-1"},{"id":"output-1"}],"edges":[{"source":"input-1","target":"text-1"},{"source":"text-1","target":"output-1"}]}'
```

Expected response:

```json
{"num_nodes":3,"num_edges":2,"is_dag":true}
```

Run this cyclic graph test:

```bash
curl -s -X POST http://127.0.0.1:8000/pipelines/parse \
  -H 'Content-Type: application/json' \
  -d '{"nodes":[{"id":"a"},{"id":"b"}],"edges":[{"source":"a","target":"b"},{"source":"b","target":"a"}]}'
```

Expected response:

```json
{"num_nodes":2,"num_edges":2,"is_dag":false}
```

### 4. Browser Flow

With both backend and frontend running:

1. Open `http://localhost:3000` or `http://localhost:3001`.
2. Confirm the toolbar shows these nodes:
   `Input`, `LLM`, `Output`, `Text`, `API`, `Transform`, `Condition`, `Delay`, `Logger`.
3. Drag a few nodes onto the canvas.
4. Connect node handles.
5. Edit a Text node and enter a variable such as `Hello {{ customerName }}`.
6. Confirm a left-side handle appears for `customerName`.
7. Click `Submit Pipeline`.
8. Confirm the alert displays node count, edge count, and DAG status.

## Assessment Mapping

| Requirement | Where It Is Implemented |
| --- | --- |
| Node abstraction | `frontend/src/nodes/baseNode.js`, `genericNode.js`, `registry.js` |
| Five new nodes | `frontend/src/nodes/registry.js` |
| Styling | `frontend/src/index.css` |
| Text auto-resize | `frontend/src/nodes/textNode.js` |
| Text variable handles | `frontend/src/nodes/textNode.js` |
| Frontend submit request | `frontend/src/submit.js` |
| Backend count and DAG parsing | `backend/main.py` |
| Alert with backend response | `frontend/src/submit.js` |

## Troubleshooting

### Submit returns `Method Not Allowed`

This usually means an old backend process is still running on port `8000`.
Stop it and restart the backend from this project.

Find the process:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
```

Stop it:

```bash
kill <PID>
```

Restart:

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend cannot submit to backend

Make sure:

- Backend is running on `http://localhost:8000`.
- Frontend is running on `http://localhost:3000` or `http://localhost:3001`.
- The browser console does not show a CORS or network error.

### Port 3000 is busy

Run:

```bash
PORT=3001 npm start
```

### VS Code shows frontend as a separate repo

This project should have one Git repo at the project root only:

```text
vectorShift_tecechnical_assessment/.git
```

Reload VS Code after opening the repository root:

```text
Cmd+Shift+P -> Developer: Reload Window
```
