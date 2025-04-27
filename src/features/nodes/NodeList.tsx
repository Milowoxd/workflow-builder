type NodeType = {
  type: string;
  label: string;
};

export default function NodeList({ onAddNode }: { onAddNode: (type: string) => void }) {
  const nodeTypes: NodeType[] = [
    { type: "start", label: "Start" },
    { type: "email", label: "Email" },
    { type: "wait", label: "Wait" },
    { type: "condition", label: "Condition" },
  ];

  return (
    <aside className="w-48 bg-gray-100 p-4">
      <h3 className="text-lg font-bold mb-4">Node Types</h3>
      <div className="flex flex-col gap-2">
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            onClick={() => onAddNode(node.type)}
            className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200 text-center"
          >
            {node.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
