import { useEffect, useMemo } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode, field } from './baseNode';

const extractVariables = (text) => {
  const variablePattern = /{{\s*([a-zA-Z_$][\w$]*)\s*}}/g;
  const variables = new Set();
  let match = variablePattern.exec(text);

  while (match) {
    variables.add(match[1]);
    match = variablePattern.exec(text);
  }

  return Array.from(variables);
};

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const currText = data?.text ?? '{{input}}';
  const variables = useMemo(() => extractVariables(currText), [currText]);
  const lines = currText.split('\n');
  const longestLine = Math.max(...lines.map((line) => line.length), 12);
  const width = Math.min(460, Math.max(240, longestLine * 7 + 92));
  const height = Math.max(150, lines.length * 24 + 114, variables.length * 34 + 84);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals, variables]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      eyebrow="Template"
      description="Use variables like {{customerName}} to create inputs."
      style={{ width, minHeight: height }}
      fields={[
        field('text', 'Text', {
          type: 'textarea',
          defaultValue: '{{input}}',
          placeholder: 'Write a prompt with {{variables}}',
        }),
      ]}
      handles={[
        ...variables.map((variable) => ({
          type: 'target',
          position: Position.Left,
          id: `${id}-${variable}`,
          label: variable,
        })),
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
          label: 'text',
        },
      ]}
    />
  );
};
