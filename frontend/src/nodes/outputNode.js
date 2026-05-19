import { Position } from 'reactflow';
import { BaseNode, field } from './baseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      eyebrow="Destination"
      description="Receives a final result from the pipeline."
      fields={[
        field('outputName', 'Name', {
          defaultValue: data?.outputName || id.replace('customOutput-', 'output_'),
        }),
        field('outputType', 'Type', {
          type: 'select',
          defaultValue: 'Text',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'Image', label: 'Image' },
          ],
        }),
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-value`,
          label: 'value',
        },
      ]}
    />
  );
};
