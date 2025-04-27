import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, Node, OnEdgesChange, OnNodesChange } from 'reactflow';
import 'reactflow/dist/style.css';
import NodeList from '../nodes/NodeList';
import { nodeTypes } from '../nodes/CustomNodes';
import Modal from '../../components/Modal'; // 👈 Asegúrate que tengas Modal.tsx

export default function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showJSON, setShowJSON] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((connection: Connection) => {
    const newEdge: Edge = {
      ...connection,
      style: { stroke: '#2c3e50', strokeWidth: 2 }, // 🔥 Color azul oscuro y más grueso
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, []);

  const handleNodeChange = (id: string, field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const addNode = (type: string) => {
    const hasStart = nodes.some((node) => node.type === 'Start');
    if (type === 'Start' && hasStart) {
      setErrorMessage('⚠️ Solo se permite un nodo Start.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    let initialData: any = { label: type, onChange: handleNodeChange, onDelete: handleDeleteNode };

    if (type === 'Email') {
      initialData = { label: type, title: '', content: '', onChange: handleNodeChange, onDelete: handleDeleteNode };
    } else if (type === 'Wait') {
      initialData = { label: type, duration: '', onChange: handleNodeChange, onDelete: handleDeleteNode };
    } else if (type === 'Condition') {
      initialData = { label: type, condition: '', onChange: handleNodeChange, onDelete: handleDeleteNode };
    }

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: initialData,
    };

    setNodes((nds) => nds.concat(newNode));
    setErrorMessage('');
  };

  const exportFlow = () => {
    setShowJSON(true);
  };

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setShowJSON(false);
    setErrorMessage('');
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-200 p-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Agregar nodo</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <NodeList addNode={addNode} />

        <button
          onClick={exportFlow}
          className="p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Exportar JSON
        </button>

        <button
          onClick={clearFlow}
          className="p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar Todo
        </button>
      </aside>

      {/* Canvas con fondo GRIS CLARO */}
      <div className="flex-1 h-full w-full bg-gray-200">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <Background gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Modal para mostrar JSON exportado */}
      <Modal isOpen={showJSON} onClose={() => setShowJSON(false)} title="Exportar Flow como JSON">
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify({ nodes, edges }, null, 2)}</pre>
      </Modal>
    </div>
  );
}
