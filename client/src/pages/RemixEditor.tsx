import { useState, useCallback } from "react";
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    Connection,
    NodeChange,
    EdgeChange,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Save, Play, Settings, Plus, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Node Component
const PromptNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="px-4 py-3 shadow-xl rounded-xl bg-card border-2 border-primary/20 min-w-[200px] backdrop-blur-md">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                    <Wand2 className="w-4 h-4 text-primary" />
                </div>
                <div className="font-bold text-sm">{data.label}</div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border/50 font-mono">
                /imagine prompt...
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
        </div>
    );
};

const nodeTypes = {
    prompt: PromptNode,
};

const initialNodes: Node[] = [
    {
        id: "1",
        type: "prompt",
        data: { label: "Base Prompt" },
        position: { x: 250, y: 5 },
    },
    {
        id: "2",
        type: "prompt",
        data: { label: "Style Modifier" },
        position: { x: 100, y: 150 },
    },
    {
        id: "3",
        type: "prompt",
        data: { label: "Lighting" },
        position: { x: 400, y: 150 },
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: 'var(--primary)' } },
    { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: 'var(--primary)' } },
];

export default function RemixEditor() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
            {/* Toolbar */}
            <div className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                    <Input
                        className="w-64 bg-transparent border-transparent hover:border-border focus:border-primary font-display font-bold text-lg"
                        defaultValue="Untitled Remix"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
                        <Play className="w-4 h-4 mr-2" />
                        Run Workflow
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-muted/5 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-dot-pattern"
                >
                    <Background color="#94a3b8" gap={16} size={1} className="opacity-20" />
                    <Controls className="bg-background border-border shadow-xl rounded-lg" />
                </ReactFlow>

                {/* Floating Palette */}
                <Card className="absolute left-6 top-6 w-64 shadow-2xl border-primary/10 backdrop-blur-xl bg-background/80">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-sm">Components</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {["Prompt Block", "Image Input", "ControlNet", "Upscaler"].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-grab active:cursor-grabbing transition-colors text-sm"
                                draggable
                            >
                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <Plus className="w-4 h-4" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
