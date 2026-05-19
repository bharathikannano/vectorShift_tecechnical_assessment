import { Position } from 'reactflow';
import { BaseNode, field } from './baseNode';

export const createGenericNode = (definition) => {
  const GenericNode = ({ id, data }) => {
    return (
      <BaseNode
        id={id}
        data={data}
        title={definition.label}
        eyebrow={definition.eyebrow}
        description={definition.description}
        fields={(definition.fields ?? []).map((item) => field(item.name, item.label, item))}
        handles={(definition.handles ?? []).map((handle) => ({
          ...handle,
          position: handle.position === 'left' ? Position.Left : Position.Right,
          id: `${id}-${handle.id}`,
        }))}
      />
    );
  };

  GenericNode.displayName = `${definition.type}Node`;

  return GenericNode;
};
