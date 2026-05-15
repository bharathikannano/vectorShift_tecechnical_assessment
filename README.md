# VectorShift Frontend Technical Assessment

A node-based pipeline builder built with React Flow and Zustand, with a small
FastAPI backend stub. The frontend lets users drag pipeline nodes onto a canvas,
connect them with edges, and edit basic node fields.

## Tech Stack

- React 18
- React Flow
- Zustand
- Create React App
- FastAPI

## Project Structure

```text
.
├── backend/
│   └── main.py
├── docs/
│   ├── current_vs_expected_graphical_view.md
│   └── project_graphical_explanation.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── inputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── outputNode.js
│   │   │   └── textNode.js
│   │   ├── App.js
│   │   ├── draggableNode.js
│   │   ├── store.js
│   │   ├── submit.js
│   │   ├── toolbar.js
│   │   └── ui.js
│   └── package.json
└── README.md
```

## Features

- Drag-and-drop node creation from the toolbar.
- React Flow canvas with background grid, minimap, and controls.
- Four node types:
  - Input
  - LLM
  - Output
  - Text
- Smooth animated edges with arrow markers.
- Zustand store for nodes, edges, and graph updates.
- Minimal FastAPI backend with a health route and placeholder pipeline parser.

## Prerequisites

- Node.js and npm
- Python 3.9+

## Frontend Setup

From the repository root:

```bash
cd frontend
npm install
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-multipart
uvicorn main:app --reload --port 8000
```

The backend runs at:

```text
http://localhost:8000
```

Available backend routes:

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Returns `{ "Ping": "Pong" }` |
| GET | `/pipelines/parse` | Placeholder parse endpoint returning `{ "status": "parsed" }` |

## Available Frontend Scripts

Run these inside the `frontend` directory:

```bash
npm start
```

Starts the development server.

```bash
npm test
```

Starts the test runner.

```bash
npm run build
```

Creates a production build in `frontend/build`.

## How The App Works

1. The toolbar renders draggable node templates.
2. Dragging a template stores its node type in the browser drag event.
3. Dropping on the React Flow canvas creates a new node at the drop position.
4. Zustand stores the node and edge arrays.
5. React Flow renders the graph from the store.
6. Nodes can be connected through their handles.

## Current Implementation Notes

- The submit button is rendered but does not currently send the graph to the backend.
- The backend parser is a placeholder and does not yet count nodes, count edges, or validate whether the graph is a DAG.
- Node field edits are kept in local component state and are not fully persisted into the global Zustand store.
- The Text node currently uses a fixed-size input and does not yet create dynamic handles from `{{ variable }}` references.

## Documentation

Additional diagrams and implementation notes are available in:

- `docs/project_graphical_explanation.md`
- `docs/current_vs_expected_graphical_view.md`
