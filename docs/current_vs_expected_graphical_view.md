# Current Vs Expected Graphical View

This document compares the implemented project with the expected finished assessment described in the VectorShift frontend technical assessment.

## 1. Big Picture Comparison

```mermaid
flowchart LR
    subgraph Current["Implemented Project"]
        C1["Reusable BaseNode abstraction"]
        C2["Drag-and-drop React Flow canvas"]
        C3["Shared polished CSS styling"]
        C4["Text node auto-resizes"]
        C5["Text variables create input handles"]
        C6["Submit button calls backend"]
        C7["Backend returns graph analysis"]
    end

    subgraph Expected["Expected Final Project"]
        E1["Reusable node abstraction"]
        E2["4 original nodes + 5 new demo nodes"]
        E3["Unified polished UI styling"]
        E4["Auto-resizing Text node"]
        E5["Text variables create input handles"]
        E6["Submit sends nodes and edges to backend"]
        E7["Backend returns node count, edge count, DAG status"]
        E8["Frontend alert displays backend response"]
    end

    C1 --> E1
    C1 --> E2
    C2 --> E3
    C3 --> E3
    C4 --> E4
    C5 --> E5
    C6 --> E6
    C7 --> E7
    E7 --> E8
```

## 2. Implemented Architecture

```mermaid
flowchart TD
    App["App.js"] --> Toolbar["Styled PipelineToolbar"]
    App --> Canvas["Styled PipelineUI"]
    App --> Submit["SubmitButton with API integration"]

    Toolbar --> Registry["Node Registry / Definitions"]
    Registry --> DN["DraggableNode"]
    DN -->|"dataTransfer: nodeType"| Canvas

    Registry --> BaseNode["Reusable BaseNode"]
    BaseNode --> Original["Input, LLM, Output, Text"]
    BaseNode --> NewNodes["API, Transform, Condition, Delay, Logger"]

    Canvas --> RF["React Flow"]
    Canvas <--> Store["Zustand Store<br/>nodes + edges + field data"]

    RF --> Original
    RF --> NewNodes
    RF --> TextLogic["Text variables + dynamic sizing"]

    Submit -->|"POST nodes + edges"| Backend["FastAPI backend"]
    Backend --> Parse["/pipelines/parse<br/>returns { num_nodes, num_edges, is_dag }"]
```

## 3. Expected Architecture

```mermaid
flowchart TD
    App["App.js"] --> Toolbar["Styled PipelineToolbar"]
    App --> Canvas["Styled PipelineUI"]
    App --> Submit["SubmitButton with API integration"]

    Toolbar --> Registry["Node Registry / Definitions"]
    Registry --> BaseNode["Reusable Base Node Abstraction"]
    BaseNode --> Original["Input, LLM, Output, Text"]
    BaseNode --> NewNodes["5 New Custom Nodes"]

    Original --> Canvas
    NewNodes --> Canvas

    Canvas <--> Store["Zustand Store<br/>nodes + edges + node data"]
    Canvas --> TextLogic["Enhanced Text Node Logic"]

    TextLogic --> Resize["Dynamic width / height"]
    TextLogic --> Variables["Parse {{ variableName }}"]
    Variables --> Handles["Create left-side target handles"]

    Submit -->|"POST/submit pipeline data"| Backend["FastAPI backend"]
    Backend --> Count["Count nodes and edges"]
    Backend --> DAG["Check directed acyclic graph"]
    Count --> Response["{ num_nodes, num_edges, is_dag }"]
    DAG --> Response
    Response --> Alert["User-friendly frontend alert"]
```

## 4. Assessment Parts As A Gap Map

```mermaid
flowchart LR
    subgraph Part1["Part 1: Node Abstraction"]
        P1C["Implemented:<br/>Nodes share BaseNode and registry definitions"]
        P1E["Expected:<br/>Reusable node builder/base component<br/>+ 5 new node types"]
        P1C --> P1E
    end

    subgraph Part2["Part 2: Styling"]
        P2C["Implemented:<br/>Shared CSS and cohesive visual treatment"]
        P2E["Expected:<br/>Appealing unified product design"]
        P2C --> P2E
    end

    subgraph Part3["Part 3: Text Node Logic"]
        P3C["Implemented:<br/>Dynamic size and variable handles"]
        P3E["Expected:<br/>Auto-resize node<br/>{{ variable }} creates left handle"]
        P3C --> P3E
    end

    subgraph Part4["Part 4: Backend Integration"]
        P4C["Implemented:<br/>Submit calls backend<br/>Backend returns graph analysis"]
        P4E["Expected:<br/>Submit graph<br/>Backend counts nodes/edges + validates DAG<br/>Alert result"]
        P4C --> P4E
    end
```

## 5. Implemented User Flow

```mermaid
sequenceDiagram
    participant User
    participant Toolbar
    participant Canvas as React Flow Canvas
    participant Store as Zustand Store
    participant Submit
    participant Backend

    User->>Toolbar: Drag node type
    Toolbar->>Canvas: Drop node type on canvas
    Canvas->>Store: Add node
    User->>Canvas: Edit node fields
    Canvas->>Store: Persist node field values
    User->>Canvas: Type text with {{ variables }}
    Canvas->>Canvas: Resize Text node and create variable handles
    User->>Canvas: Connect handles
    Canvas->>Store: Add edge
    User->>Submit: Click Submit
    Submit->>Store: Read nodes and edges
    Submit->>Backend: Send pipeline
    Backend->>Backend: Count nodes
    Backend->>Backend: Count edges
    Backend->>Backend: Validate DAG
    Backend-->>Submit: Return num_nodes, num_edges, is_dag
    Submit-->>User: Show friendly alert
```

## 6. Expected User Flow

```mermaid
sequenceDiagram
    participant User
    participant Toolbar
    participant Canvas as React Flow Canvas
    participant Store as Zustand Store
    participant Submit
    participant Backend

    User->>Toolbar: Drag original or new node type
    Toolbar->>Canvas: Drop node type on canvas
    Canvas->>Store: Add node from reusable abstraction
    User->>Canvas: Edit node fields
    Canvas->>Store: Persist node field values
    User->>Canvas: Type text with {{ variables }}
    Canvas->>Canvas: Resize Text node and create variable handles
    User->>Canvas: Connect handles
    Canvas->>Store: Add edge
    User->>Submit: Click Submit
    Submit->>Store: Read nodes and edges
    Submit->>Backend: Send pipeline
    Backend->>Backend: Count nodes
    Backend->>Backend: Count edges
    Backend->>Backend: Validate DAG
    Backend-->>Submit: Return num_nodes, num_edges, is_dag
    Submit-->>User: Show friendly alert
```

## 7. Implementation Roadmap

```mermaid
flowchart TD
    Start["Start from current code"] --> A["Create reusable BaseNode component"]
    A --> B["Convert Input, LLM, Output, Text to use BaseNode"]
    B --> C["Add 5 new node definitions"]
    C --> D["Replace inline styles with shared design system styles"]
    D --> E["Enhance Text node sizing"]
    E --> F["Parse {{ variable }} names"]
    F --> G["Render dynamic Text node target handles"]
    G --> H["Update SubmitButton to send nodes + edges"]
    H --> I["Update FastAPI parse endpoint"]
    I --> J["Return { num_nodes, num_edges, is_dag }"]
    J --> K["Show frontend alert"]
    K --> Done["Assessment complete"]
```

## 8. Status Matrix

| Area | Current State | Expected State | Status |
| --- | --- | --- | --- |
| Node abstraction | Nodes render through `BaseNode` plus registry definitions | Shared abstraction that makes new nodes easy | Done |
| New nodes | API, Transform, Condition, Delay, Logger added | Five additional custom nodes | Done |
| Styling | Shared CSS for toolbar, canvas, nodes, controls, and submit flow | Cohesive polished UI | Done |
| Text resizing | Text node dimensions respond to content length and line count | Node grows with text content | Done |
| Text variables | `{{variableName}}` tokens become unique left-side handles | Variables create matching left handles | Done |
| Store integration | Node field edits update Zustand node data immutably | Field edits should also persist cleanly | Done |
| Submit button | Sends current nodes and edges as JSON to FastAPI | Sends pipeline to backend | Done |
| Backend parse | Counts nodes, counts edges, and validates DAG with topological sort | Counts nodes, counts edges, validates DAG | Done |
| User result | Browser alert displays `num_nodes`, `num_edges`, and `is_dag` | Alert shows `num_nodes`, `num_edges`, `is_dag` | Done |

## 9. One-Screen Summary

```mermaid
flowchart LR
    Current["Implemented:<br/>A polished pipeline builder"] --> Needed["Assessment requirements"]

    Needed --> N1["Reusable nodes"]
    Needed --> N2["More node types"]
    Needed --> N3["Better styling"]
    Needed --> N4["Smarter Text node"]
    Needed --> N5["Backend submission"]
    Needed --> N6["DAG analysis response"]
```
