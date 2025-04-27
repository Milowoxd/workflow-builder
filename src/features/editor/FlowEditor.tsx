import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeList from "../nodes/NodeList";
import EditableNode from "../nodes/EditableNode";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  editableNode: EditableNode,
};

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [exportedJson, setExportedJson] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onChange = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...newData, onChange };
        }
        return node;
      })
    );
  };

  const addNode = (nodeType: string) => {
    const id = `${+new Date()}`;
    const position = { x: Math.random() * 400, y: Math.random() * 400 };

    if (nodeType === "start" && nodes.some((n) => n.data.label.toLowerCase() === "start")) {
      alert("Ya existe un nodo Start.");
      return;
    }

    setNodes((nds) =>
      nds.concat({
        id,
        type: "editableNode",
        position,
        data: { label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1), onChange },
      })
    );
  };

  const exportFlow = () => {
    if (nodes.length === 0) {
      setErrorModalOpen(true);
      return;
    }

    const startNode = nodes.find((n) => n.data.label.toLowerCase() === "start");

    const flow = {
      start: startNode ? startNode.id : null,
      nodes: nodes.map((node) => {
        const outgoing = edges.find((edge) => edge.source === node.id);
        return {
          id: node.id,
          type: node.data.label,
          data: {
            label: node.data.label,
            content: node.data.content,
            duration: node.data.duration,
            condition: node.data.condition,
          },
          next: outgoing?.target || null,
        };
      }),
    };

    console.info(flow);
    const json = JSON.stringify(flow, null, 2);
    setExportedJson(json);
    setJsonModalOpen(true);
  };

  const copyJsonToClipboard = () => {
    if (exportedJson) {
      navigator.clipboard.writeText(exportedJson);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Botón Exportar */}
      <div className="p-2 bg-gray-100">
        <button
          onClick={exportFlow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Exportar Flow
        </button>
      </div>

      {/* Área principal */}
      <div className="flex flex-1 overflow-hidden">
        <NodeList onAddNode={addNode} />

        <div className="flex-1 h-full bg-white">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              nodeTypes={nodeTypes}
              onInit={(instance) => {
                // 👈 Aquí centramos los nodos automáticamente
                setTimeout(() => {
                  instance.fitView({ padding: 0.4 });
                }, 100);
              }}
            >
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Modal Export JSON */}
      {jsonModalOpen && exportedJson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Flujo Exportado</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm max-h-96">
              {exportedJson}
            </pre>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={copyJsonToClipboard}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Copiar JSON
              </button>
              <button
                onClick={() => setJsonModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Error */}
      {errorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-red-600">Error</h2>
            <p className="text-gray-700 mb-6">
              Por favor, agrega al menos un nodo antes de exportar el flujo.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast éxito */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce z-50">
          ¡JSON copiado al portapapeles!
        </div>
      )}
    </div>
  );
}

export default function FlowEditor() {
  return (
    <div className="flex w-full h-screen">
      <FlowCanvas />
    </div>
  );
}
