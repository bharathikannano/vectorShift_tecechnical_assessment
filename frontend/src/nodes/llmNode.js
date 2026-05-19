import { Position } from 'reactflow';
import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      eyebrow="Model"
      description="Combines system context and a prompt into a response."
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-system`,
          label: 'system',
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-prompt`,
          label: 'prompt',
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
          label: 'response',
        },
      ]}
    />
  );
};
