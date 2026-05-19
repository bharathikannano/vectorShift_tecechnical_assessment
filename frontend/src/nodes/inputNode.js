import { Position } from 'reactflow';
import { BaseNode, field } from './baseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      eyebrow="Source"
      description="Accepts user-provided text or files."
      fields={[
        field('inputName', 'Name', {
          defaultValue: data?.inputName || id.replace('customInput-', 'input_'),
        }),
        field('inputType', 'Type', {
          type: 'select',
          defaultValue: 'Text',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
          ],
        }),
      ]}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-value`,
          label: 'value',
        },
      ]}
    />
  );
};
