import { Handle, Position } from "reactflow";

type EditableNodeProps = {
  id: string;
  data: {
    label: string;
    content?: string;
    duration?: string;
    condition?: string;
    onChange: (id: string, value: any) => void;
  };
};

export default function EditableNode({ id, data }: EditableNodeProps) {
  const { label, content, duration, condition, onChange } = data;

  const getNodeStyle = () => {
    switch (label.toLowerCase()) {
      case "start":
        return "bg-green-400";
      case "email":
        return "bg-blue-400";
      case "wait":
        return "bg-yellow-400";
      case "condition":
        return "bg-orange-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={`p-4 rounded-lg text-white w-64 ${getNodeStyle()}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-2">
        <input
          className="w-full text-black rounded px-2 py-1"
          value={label}
          onChange={(e) => onChange(id, { ...data, label: e.target.value })}
        />

        {label.toLowerCase() === "email" && (
          <textarea
            className="w-full text-black rounded px-2 py-1"
            placeholder="Contenido del email"
            value={content || ""}
            onChange={(e) => onChange(id, { ...data, content: e.target.value })}
          />
        )}

        {label.toLowerCase() === "wait" && (
          <input
            type="number"
            className="w-full text-black rounded px-2 py-1"
            placeholder="Horas de espera"
            value={duration || ""}
            onChange={(e) => onChange(id, { ...data, duration: e.target.value })}
          />
        )}

        {label.toLowerCase() === "condition" && (
          <input
            type="text"
            className="w-full text-black rounded px-2 py-1"
            placeholder="Condición lógica"
            value={condition || ""}
            onChange={(e) => onChange(id, { ...data, condition: e.target.value })}
          />
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
      {label.toLowerCase() === "condition" && (
        <>
          <Handle type="source" position={Position.Left} id="true" />
          <Handle type="source" position={Position.Right} id="false" />
        </>
      )}
    </div>
  );
}
