import React from 'react';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

export function StartNode({ data, id }: any) {
  return (
    <div className="relative bg-red-400 p-4 rounded-full text-white text-center shadow-md">
      <button
        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
        onClick={() => data.onDelete(id)}
      >
        ❌
      </button>
      <input
        className="bg-transparent border-none outline-none w-full text-center text-white font-bold"
        value={data.label}
        onChange={(e) => data.onChange(id, 'label', e.target.value)}
        placeholder="Start"
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function EmailNode({ data, id }: any) {
  return (
    <div className="relative bg-blue-300 p-4 rounded-lg text-black shadow-md w-64">
      <button
        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
        onClick={() => data.onDelete(id)}
      >
        ❌
      </button>
      <input
        className="font-bold w-full mb-2 bg-transparent border-none outline-none text-center"
        value={data.title}
        onChange={(e) => data.onChange(id, 'title', e.target.value)}
        placeholder="Título Email"
      />
      <textarea
        className="w-full bg-transparent border-none outline-none text-sm text-center resize-none"
        value={data.content}
        onChange={(e) => data.onChange(id, 'content', e.target.value)}
        placeholder="Contenido del Email"
      />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function WaitNode({ data, id }: any) {
  return (
    <div className="relative border-2 border-dashed border-blue-400 p-4 rounded-md text-center shadow-md w-40">
      <button
        className="absolute -top-2 -right-2 bg-white text-blue-500 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
        onClick={() => data.onDelete(id)}
      >
        ❌
      </button>
      <div className="font-bold">Wait</div>
      <input
        className="w-full bg-transparent border-none outline-none text-center mt-2"
        value={data.duration}
        onChange={(e) => data.onChange(id, 'duration', e.target.value)}
        placeholder="Horas"
      />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function ConditionNode({ data, id }: any) {
  return (
    <div className="relative bg-blue-400 p-4 rotate-45 text-center text-white shadow-md w-24 h-24 flex items-center justify-center">
      <button
        className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow rotate-[-45deg]"
        onClick={() => data.onDelete(id)}
      >
        ❌
      </button>
      <div className="-rotate-45 w-full">
        <input
          className="bg-transparent border-none outline-none text-center w-full text-white font-bold"
          value={data.condition}
          onChange={(e) => data.onChange(id, 'condition', e.target.value)}
          placeholder="Condición"
        />
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="true" />
      <Handle type="source" position={Position.Bottom} id="false" />
    </div>
  );
}

export const nodeTypes = {
  Start: StartNode,
  Email: EmailNode,
  Wait: WaitNode,
  Condition: ConditionNode,
};
