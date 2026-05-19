import { useStore } from './store';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const handleSubmit = async () => {
        const { nodes: latestNodes, edges: latestEdges } = useStore.getState();

        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes: latestNodes, edges: latestEdges }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json();
            alert(
                `Pipeline summary\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nDAG: ${
                    result.is_dag ? 'Yes' : 'No'
                }`
            );
        } catch (error) {
            alert(`Unable to submit pipeline: ${error.message}`);
        }
    };

    return (
        <div className="submit-bar">
            <div className="pipeline-stats" aria-live="polite">
                <span>{nodes.length} nodes</span>
                <span>{edges.length} edges</span>
            </div>
            <button className="submit-button" type="button" onClick={handleSubmit}>
                Submit Pipeline
            </button>
        </div>
    );
}
