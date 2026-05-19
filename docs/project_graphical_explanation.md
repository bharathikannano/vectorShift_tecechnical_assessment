# Project Graphical Explanation

This project is a node-based pipeline builder. The frontend lets users drag node types onto a React Flow canvas and connect them with edges. Zustand stores the graph state. The backend is a minimal FastAPI service with a health route and a placeholder pipeline parsing route.

## 1. System Overview

```mermaid
flowchart LR
    User["User"] --> Toolbar["PipelineToolbar<br/>frontend/src/toolbar.js"]
    Toolbar --> DragNode["DraggableNode<br/>frontend/src/draggableNode.js"]
    DragNode --> Canvas["PipelineUI / React Flow Canvas<br/>frontend/src/ui.js"]
    Canvas <--> Store["Zustand Store<br/>frontend/src/store.js"]
    Canvas --> NodeComponents["Custom Node Components<br/>frontend/src/nodes/*"]
    Submit["SubmitButton<br/>frontend/src/submit.js"] -. currently not wired .-> Backend["FastAPI Backend<br/>backend/main.py"]
    Backend --> Parse["GET /pipelines/parse<br/>returns { status: parsed }"]
```

## 2. Frontend Composition

```mermaid
flowchart TD
    App["App.js"] --> Toolbar["PipelineToolbar"]
    App --> UI["PipelineUI"]
    App --> Submit["SubmitButton"]

    Toolbar --> D1["DraggableNode: Input"]
    Toolbar --> D2["DraggableNode: LLM"]
    Toolbar --> D3["DraggableNode: Output"]
    Toolbar --> D4["DraggableNode: Text"]

    UI --> RF["ReactFlow"]
    RF --> InputNode["InputNode"]
    RF --> LLMNode["LLMNode"]
    RF --> OutputNode["OutputNode"]
    RF --> TextNode["TextNode"]
    RF --> MiniMap["MiniMap"]
    RF --> Controls["Controls"]
    RF --> Background["Background"]
```

## 3. Drag And Drop Flow

```mermaid
sequenceDiagram
    participant User
    participant DraggableNode
    participant PipelineUI
    participant Store as Zustand Store
    participant ReactFlow

    User->>DraggableNode: Starts dragging a toolbar node
    DraggableNode->>DraggableNode: Stores { nodeType } in dataTransfer
    User->>PipelineUI: Drops node on canvas
    PipelineUI->>PipelineUI: Reads nodeType from dataTransfer
    PipelineUI->>ReactFlow: Converts screen position to canvas position
    PipelineUI->>Store: getNodeID(type)
    Store-->>PipelineUI: unique id, e.g. text-1
    PipelineUI->>Store: addNode(newNode)
    Store-->>ReactFlow: updated nodes array
    ReactFlow-->>User: New node appears on canvas
```

## 4. State And Graph Model

```mermaid
classDiagram
    class useStore {
        nodes: Array
        edges: Array
        getNodeID(type)
        addNode(node)
        onNodesChange(changes)
        onEdgesChange(changes)
        onConnect(connection)
        updateNodeField(nodeId, fieldName, fieldValue)
    }

    class Node {
        id
        type
        position
        data
    }

    class Edge {
        source
        target
        sourceHandle
        targetHandle
        type: smoothstep
        animated: true
        markerEnd: arrow
    }

    useStore "1" --> "*" Node
    useStore "1" --> "*" Edge
```

## 5. Node Types And Handles

```mermaid
flowchart LR
    Input["InputNode<br/>source: value"] --> LLM["LLMNode<br/>targets: system, prompt<br/>source: response"]
    Text["TextNode<br/>source: output"] --> LLM
    LLM --> Output["OutputNode<br/>target: value"]
    Text --> Output
```

| Node | File | Purpose | Handles |
| --- | --- | --- | --- |
| Input | `frontend/src/nodes/inputNode.js` | Defines a named user input with Text/File type | One source handle: `value` |
| LLM | `frontend/src/nodes/llmNode.js` | Represents an LLM processing step | Two target handles: `system`, `prompt`; one source handle: `response` |
| Output | `frontend/src/nodes/outputNode.js` | Defines a named output with Text/Image option | One target handle: `value` |
| Text | `frontend/src/nodes/textNode.js` | Provides a text/template value such as `{{input}}` | One source handle: `output` |

## 6. Backend Shape

```mermaid
flowchart TD
    Client["Frontend client"] --> Root["GET /"]
    Root --> Pong["{ Ping: Pong }"]

    Client --> Parse["GET /pipelines/parse<br/>pipeline form field"]
    Parse --> Status["{ status: parsed }"]
```

The backend exists, but the frontend `SubmitButton` does not currently send graph data to it. The parse endpoint also does not yet analyze nodes, edges, or DAG validity.

## 7. Current Implementation Gaps

```mermaid
flowchart TD
    Existing["Current project"] --> Working["Working basics"]
    Existing --> Missing["Missing or incomplete"]

    Working --> W1["Toolbar drag sources"]
    Working --> W2["React Flow canvas"]
    Working --> W3["Zustand graph state"]
    Working --> W4["Node and edge rendering"]

    Missing --> M1["Submit button API call"]
    Missing --> M2["Backend pipeline parsing"]
    Missing --> M3["DAG validation"]
    Missing --> M4["Counting nodes and edges"]
    Missing --> M5["Persisting node field edits into Zustand"]
    Missing --> M6["Reusable node abstraction / styling polish"]
```

## 8. Plain-English Summary

The app is organized around a graph editing loop:

1. The toolbar exposes node templates.
2. A user drags a template onto the canvas.
3. `PipelineUI` creates a React Flow node object with a unique id and position.
4. Zustand stores the node and later stores edges when handles are connected.
5. React Flow renders the graph from the store.
6. The backend is ready to receive pipeline data, but the frontend submission and real parsing logic still need to be implemented.

