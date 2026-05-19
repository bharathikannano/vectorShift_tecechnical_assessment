import { InputNode } from './inputNode';
import { LLMNode } from './llmNode';
import { OutputNode } from './outputNode';
import { TextNode } from './textNode';
import { createGenericNode } from './genericNode';

export const nodeDefinitions = [
  {
    type: 'customInput',
    label: 'Input',
    group: 'Core',
  },
  {
    type: 'llm',
    label: 'LLM',
    group: 'Core',
  },
  {
    type: 'customOutput',
    label: 'Output',
    group: 'Core',
  },
  {
    type: 'text',
    label: 'Text',
    group: 'Core',
  },
  {
    type: 'api',
    label: 'API',
    group: 'Tools',
    eyebrow: 'Connector',
    description: 'Fetches data from an external endpoint.',
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PATCH', label: 'PATCH' },
        ],
      },
      {
        name: 'url',
        label: 'URL',
        placeholder: 'https://api.example.com',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'request', label: 'request' },
      { type: 'source', position: 'right', id: 'response', label: 'response' },
    ],
  },
  {
    type: 'transform',
    label: 'Transform',
    group: 'Tools',
    eyebrow: 'Logic',
    description: 'Maps incoming data into a new shape.',
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Summarize',
        options: [
          { value: 'Summarize', label: 'Summarize' },
          { value: 'Normalize', label: 'Normalize' },
          { value: 'Extract', label: 'Extract' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'input' },
      { type: 'source', position: 'right', id: 'output', label: 'output' },
    ],
  },
  {
    type: 'condition',
    label: 'Condition',
    group: 'Tools',
    eyebrow: 'Branch',
    description: 'Routes data based on a simple condition.',
    fields: [
      {
        name: 'condition',
        label: 'When',
        placeholder: 'score > 0.8',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'input' },
      { type: 'source', position: 'right', id: 'true', label: 'true' },
      { type: 'source', position: 'right', id: 'false', label: 'false' },
    ],
  },
  {
    type: 'delay',
    label: 'Delay',
    group: 'Tools',
    eyebrow: 'Timing',
    description: 'Waits before passing data to the next step.',
    fields: [
      {
        name: 'duration',
        label: 'Seconds',
        type: 'number',
        defaultValue: '3',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'input' },
      { type: 'source', position: 'right', id: 'output', label: 'output' },
    ],
  },
  {
    type: 'logger',
    label: 'Logger',
    group: 'Tools',
    eyebrow: 'Observe',
    description: 'Records intermediate pipeline data.',
    fields: [
      {
        name: 'level',
        label: 'Level',
        type: 'select',
        defaultValue: 'Info',
        options: [
          { value: 'Info', label: 'Info' },
          { value: 'Warn', label: 'Warn' },
          { value: 'Error', label: 'Error' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'eventIn', label: 'event' },
      { type: 'source', position: 'right', id: 'eventOut', label: 'event' },
    ],
  },
];

const customNodes = nodeDefinitions
  .filter((definition) => definition.group === 'Tools')
  .reduce((nodes, definition) => {
    nodes[definition.type] = createGenericNode(definition);
    return nodes;
  }, {});

export const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  ...customNodes,
};

export const getNodeDefinition = (type) => nodeDefinitions.find((node) => node.type === type);
