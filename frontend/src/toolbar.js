import { DraggableNode } from './draggableNode';
import { nodeDefinitions } from './nodes/registry';

export const PipelineToolbar = () => {
    const groups = nodeDefinitions.reduce((items, node) => {
        items[node.group] = items[node.group] ?? [];
        items[node.group].push(node);
        return items;
    }, {});

    return (
        <div className="pipeline-toolbar">
            <div>
                <h1>Pipeline Builder</h1>
                <p>Drag nodes onto the canvas and connect their handles.</p>
            </div>

            {Object.entries(groups).map(([group, nodes]) => (
                <section className="toolbar-section" key={group}>
                    <span>{group}</span>
                    <div className="toolbar-nodes">
                        {nodes.map((node) => (
                            <DraggableNode key={node.type} type={node.type} label={node.label} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
