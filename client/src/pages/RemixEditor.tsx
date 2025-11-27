import { useState, useCallback, useEffect } from "react";
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
import { Save, Settings, Plus, Wand2 } from "lucide-react";
import { TechShell } from "@/components/layout/TechShell";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Custom Node Component
const PromptNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="px-4 py-3 shadow-xl rounded-3xl bg-card border-2 border-blue-400/20 min-w-[200px] backdrop-blur-md">
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-400 rounded-full" />
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-blue-400/10">
                    <Wand2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="font-bold text-sm">{data.label}</div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-2xl border border-border/50 font-mono">
                /imagine prompt...
            </div>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-400 rounded-full" />
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
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: 'hsl(var(--primary))' } },
    { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: 'hsl(var(--primary))' } },
];

export default function RemixEditor() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

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
        <LayoutGroup>
            <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">
                {/* Splash Screen */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                layoutId="logo"
                                className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white"
                            >
                                REMIX
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <TechShell loading={loading} logoText="REMIX">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Toolbar */}
                        <div className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 z-10">
                            <div className="flex items-center gap-4">
                                <Input
                                    className="w-64 bg-transparent border-2 border-white/20 hover:border-white/40 focus:border-blue-400 font-display font-bold text-lg rounded-full"
                                    defaultValue="Untitled Remix"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-full border-2 border-white/20">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Remix
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
                                <Background color="hsl(var(--muted-foreground))" gap={16} size={1} className="opacity-20" />
                                <Controls className="bg-background border-2 border-white/10 shadow-xl rounded-2xl" />
                            </ReactFlow>

                            {/* Floating Palette */}
                            <Card className="absolute left-6 top-6 w-64 shadow-2xl border-2 border-white/10 backdrop-blur-xl bg-background/80 rounded-3xl hidden md:block">
                                <div className="p-4 border-b border-white/10">
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Components</h3>
                                </div>
                                <div className="p-2 space-y-1">
                                    {["Prompt Block", "Image Input", "ControlNet", "Upscaler"].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted cursor-grab active:cursor-grabbing transition-colors text-sm"
                                            draggable
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-400">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TechShell>
            </div>
        </LayoutGroup>
    );
}
