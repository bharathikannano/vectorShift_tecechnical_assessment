# Assignment Submission Walkthrough

This document summarizes the current application changes point by point for the
VectorShift frontend technical assessment submission.

## 1. Node Abstraction

- Added a reusable node layout component in `frontend/src/nodes/baseNode.js`.
- Added `frontend/src/nodes/genericNode.js` to quickly create simple nodes from configuration.
- Added `frontend/src/nodes/registry.js` as the central place for node definitions.
- Refactored the original nodes to use the shared abstraction:
  - Input
  - LLM
  - Output
  - Text
- Added five new demo nodes to show the abstraction is reusable:
  - API
  - Transform
  - Condition
  - Delay
  - Logger

## 2. Styling

- Updated `frontend/src/index.css` with a unified visual design.
- Styled the toolbar, draggable node buttons, React Flow canvas, node cards, inputs, handles, and submit area.
- Added a live node/edge count near the submit button so users can see the graph state before submitting.

## 3. Text Node Logic

- Updated `frontend/src/nodes/textNode.js`.
- The Text node now grows in width and height as text content increases.
- The Text node detects valid variables written with double curly brackets, such as:

```text
{{ input }}
{{ customerName }}
```

- Each detected variable creates a matching target handle on the left side of the Text node.
- Duplicate variables are handled once, so repeated `{{ input }}` values do not create duplicate handles.

## 4. Backend Integration

- Updated `frontend/src/submit.js` so the submit button sends the current `nodes` and `edges` to the backend.
- Submit now reads the latest Zustand store state at click time.
- The frontend shows a user-friendly alert with:
  - number of nodes
  - number of edges
  - whether the graph is a DAG

## 5. Backend Parsing

- Updated `backend/main.py`.
- Added a POST endpoint:

```text
/pipelines/parse
```

- The endpoint returns:

```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

- DAG validation is implemented with a topological-sort style check.
- Cyclic graphs return `is_dag: false`.

## 6. How To Validate Quickly

Start backend:

```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000
```

Start frontend:

```bash
cd frontend
npm start
```

Manual validation:

1. Open the frontend in the browser.
2. Confirm all nine nodes appear in the toolbar.
3. Drag nodes onto the canvas.
4. Connect handles between nodes.
5. Add text like `Hello {{ customerName }}` in a Text node.
6. Confirm a left-side `customerName` handle appears.
7. Click `Submit Pipeline`.
8. Confirm the alert shows node count, edge count, and DAG status.

## 7. Files Most Relevant To Review

- `frontend/src/nodes/baseNode.js`
- `frontend/src/nodes/genericNode.js`
- `frontend/src/nodes/registry.js`
- `frontend/src/nodes/textNode.js`
- `frontend/src/submit.js`
- `frontend/src/store.js`
- `frontend/src/index.css`
- `backend/main.py`
