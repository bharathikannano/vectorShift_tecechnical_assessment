import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionClass = {
  [Position.Left]: 'node-handle-label-left',
  [Position.Right]: 'node-handle-label-right',
};

const defaultHandleOffset = (index, total) => `${((index + 1) * 100) / (total + 1)}%`;

const getInitialValue = (data, field) => {
  if (data?.[field.name] !== undefined) {
    return data[field.name];
  }

  return field.defaultValue ?? '';
};

const NodeInput = ({ id, data, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const value = getInitialValue(data, field);

  const handleChange = (event) => {
    updateNodeField(id, field.name, event.target.value);
  };

  if (field.type === 'select') {
    return (
      <select className="node-control nodrag" value={value} onChange={handleChange}>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        className="node-control node-textarea nodrag"
        value={value}
        placeholder={field.placeholder}
        onChange={handleChange}
      />
    );
  }

  return (
    <input
      className="node-control nodrag"
      type={field.type ?? 'text'}
      value={value}
      placeholder={field.placeholder}
      onChange={handleChange}
    />
  );
};

export const BaseNode = ({
  id,
  data,
  title,
  eyebrow,
  description,
  fields = [],
  handles = [],
  children,
  style,
}) => {
  const groupedHandles = handles.reduce((groups, handle) => {
    const key = `${handle.position}-${handle.type}`;
    groups[key] = groups[key] ?? [];
    groups[key].push(handle);
    return groups;
  }, {});

  const handlesWithOffsets = handles.map((handle) => {
    const group = groupedHandles[`${handle.position}-${handle.type}`];
    const groupIndex = group.indexOf(handle);
    const top = handle.top ?? defaultHandleOffset(groupIndex, group.length);

    return { ...handle, top };
  });

  return (
    <div className="base-node" style={style}>
      {handlesWithOffsets.map((handle) => (
        <div key={`${handle.type}-${handle.id}`} className="node-handle-wrap">
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={{ top: handle.top, ...handle.style }}
          />
          {handle.label && (
            <span
              className={`node-handle-label ${positionClass[handle.position] ?? ''}`}
              style={{ top: handle.top }}
            >
              {handle.label}
            </span>
          )}
        </div>
      ))}

      <div className="node-header">
        {eyebrow && <span className="node-eyebrow">{eyebrow}</span>}
        <strong>{title}</strong>
      </div>

      {description && <p className="node-description">{description}</p>}

      {fields.length > 0 && (
        <div className="node-fields">
          {fields.map((field) => (
            <label className="node-field" key={field.name}>
              <span>{field.label}</span>
              <NodeInput id={id} data={data} field={field} />
            </label>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};

export const field = (name, label, config = {}) => ({ name, label, ...config });
