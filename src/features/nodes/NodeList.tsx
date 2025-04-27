// src/features/nodes/NodeList.tsx
interface NodeListProps {
    addNode: (type: string) => void;
  }
  
  export default function NodeList({ addNode }: NodeListProps) {
    const nodeTypes = ['Start', 'Email', 'Wait', 'Condition'];
  
    return (
      <div className="flex flex-col gap-2">
        {nodeTypes.map((type) => (
          <button
            key={type}
            onClick={() => addNode(type)}
            className="bg-gray-300 p-2 rounded hover:bg-gray-400"
          >
            {type}
          </button>
        ))}
      </div>
    );
  }
  