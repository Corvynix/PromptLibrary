import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TechShell } from "@/components/layout/TechShell";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    FileText,
    ShieldAlert,
    Activity,
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Ban,
    Trash2,
    Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboard() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");

    // Fetch Stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["/api/admin/stats"],
    });

    // Fetch Users
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["/api/admin/users"],
    });

    // Fetch Moderation Queue
    const { data: moderationQueue, isLoading: moderationLoading } = useQuery({
        queryKey: ["/api/admin/moderation"],
    });

    // Ban User Mutation
    const banUserMutation = useMutation({
        mutationFn: async ({ userId, banned }: { userId: number; banned: boolean }) => {
            await apiRequest("POST", `/api/admin/users/${userId}/ban`, { banned });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({ title: "User status updated" });
        },
    });

    // Moderate Content Mutation
    const moderateMutation = useMutation({
        mutationFn: async ({ type, id, action }: { type: string; id: number; action: string }) => {
            await apiRequest("POST", `/api/admin/moderate/${type}/${id}`, { action });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/moderation"] });
            toast({ title: "Content moderated" });
        },
    });

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <Card className="border-2 border-white/10 bg-black/50 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-mono text-muted-foreground mb-1 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <TechShell logoText="ADMIN">
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter mb-2">DASHBOARD</h1>
                            <p className="text-muted-foreground font-mono">System Overview & Management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-full border-2 border-white/20">
                                <Activity className="w-4 h-4 mr-2" />
                                System Logs
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Users"
                            value={stats?.totalUsers || 0}
                            icon={Users}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Total Prompts"
                            value={stats?.totalPrompts || 0}
                            icon={FileText}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Uses"
                            value={stats?.totalUses || 0}
                            icon={Activity}
                            color="bg-green-500"
                        />
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
                        <TabsList className="bg-black border-2 border-white/10 p-1 rounded-full h-auto">
                            {["overview", "users", "prompts", "moderation"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-full px-6 py-2 font-bold tracking-wide data-[state=active]:bg-white data-[state=active]:text-black uppercase text-xs"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <Card className="border-2 border-white/10 bg-black/50">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest system events and actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center h-40 text-muted-foreground font-mono text-sm">
                                        No recent activity logs available
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Users Tab */}
                        <TabsContent value="users" className="space-y-6">
                            <Card className="border-2 border-white/10 bg-black/50">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>User Management</CardTitle>
                                        <CardDescription>Manage user accounts and permissions</CardDescription>
                                    </div>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users..."
                                            className="pl-9 rounded-full bg-black border-white/20"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {users?.map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-white/20">
                                                        <AvatarImage src={user.avatarUrl} />
                                                        <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold">{user.displayName}</p>
                                                            {user.isBanned && (
                                                                <Badge variant="destructive" className="text-[10px] px-2 py-0.5 h-5">BANNED</Badge>
                                                            )}
                                                            {user.roles?.includes("admin") && (
                                                                <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 border-blue-500 text-blue-500">ADMIN</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-full">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem
                                                            className={user.isBanned ? "text-green-500" : "text-red-500"}
                                                            onClick={() => banUserMutation.mutate({ userId: user.id, banned: !user.isBanned })}
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            {user.isBanned ? "Unban User" : "Ban User"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Prompts Tab */}
                        <TabsContent value="prompts">
                            <Card className="border-2 border-white/10 bg-black/50">
                                <CardHeader>
                                    <CardTitle>Prompt Management</CardTitle>
                                    <CardDescription>Manage and curate prompts</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center h-40 text-muted-foreground font-mono text-sm">
                                        Prompt management features coming soon
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Moderation Tab */}
                        <TabsContent value="moderation">
                            <Card className="border-2 border-white/10 bg-black/50">
                                <CardHeader>
                                    <CardTitle>Moderation Queue</CardTitle>
                                    <CardDescription>Review flagged content</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {moderationQueue?.flagged?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                            <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                                            <p className="font-mono text-sm">All caught up! No flagged content.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {moderationQueue?.flagged?.map((item: any) => (
                                                <div key={item.id} className="p-4 border border-white/10 rounded-2xl">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                                            <p className="text-sm text-muted-foreground">{item.shortDesc}</p>
                                                        </div>
                                                        <Badge variant="destructive">FLAGGED</Badge>
                                                    </div>
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => moderateMutation.mutate({ type: "prompt_version", id: item.id, action: "reject" })}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => moderateMutation.mutate({ type: "prompt_version", id: item.id, action: "approve" })}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TechShell>
    );
}
