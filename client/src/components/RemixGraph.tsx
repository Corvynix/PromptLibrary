import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Custom Node Component
const PromptNode = ({ data }: { data: any }) => {
    return (
        <Card className={`w-64 border-2 ${data.isCurrent ? 'border-primary' : 'border-border'}`}>
            <CardContent className="p-3">
                <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted-foreground" />

                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={data.author?.avatarUrl} />
                            <AvatarFallback>{data.author?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium truncate max-w-[100px]">
                            {data.author?.displayName || 'Unknown'}
                        </span>
                    </div>
                    <Badge variant={data.pqasScore?.composite >= 90 ? "default" : "secondary"} className="text-[10px] h-5">
                        PQAS: {data.pqasScore?.composite || 'N/A'}
                    </Badge>
                </div>

                <div className="text-sm font-semibold mb-1 truncate">v{data.versionNumber}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                    {data.summary || 'No summary provided'}
                </div>

                <div className="mt-2 flex gap-1 flex-wrap">
                    {data.isCurrent && (
                        <Badge variant="outline" className="text-[10px] border-primary text-primary">
                            Current
                        </Badge>
                    )}
                </div>

                <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-muted-foreground" />
            </CardContent>
        </Card>
    );
};

const nodeTypes = {
    promptNode: PromptNode,
};

interface RemixGraphProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
}

export default function RemixGraph({ initialNodes, initialEdges, onNodeClick }: RemixGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Update nodes when props change
    React.useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    return (
        <div className="w-full h-[600px] border rounded-lg bg-slate-50 dark:bg-slate-950">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
