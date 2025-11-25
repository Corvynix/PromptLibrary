import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    Activity,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    BarChart3,
    Search,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const REPORTS = [
    { id: 1, type: "Spam", target: "Crypto Scams v2", reporter: "user123", status: "pending", severity: "high" },
    { id: 2, type: "Inappropriate", target: "NSFW Generator", reporter: "mod_alice", status: "pending", severity: "medium" },
    { id: 3, type: "Copyright", target: "Disney Style", reporter: "legal_team", status: "resolved", severity: "low" },
];

const USERS = [
    { id: 1, username: "spammer_bot", email: "bot@spam.com", role: "user", status: "flagged" },
    { id: 2, username: "good_user", email: "user@gmail.com", role: "pro", status: "active" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Platform overview and moderation tools.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Activity className="w-4 h-4 mr-2" />
                        System Status
                    </Button>
                    <Button>
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">12,450</div>
                            <div className="text-xs text-muted-foreground">Total Users</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">1,203</div>
                            <div className="text-xs text-muted-foreground">Active Today</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-full text-orange-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">15</div>
                            <div className="text-xs text-muted-foreground">Pending Reports</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-full text-purple-500">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">$4,250</div>
                            <div className="text-xs text-muted-foreground">Revenue (MRR)</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="moderation" className="w-full">
                <TabsList>
                    <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="analytics">Viral Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="moderation" className="space-y-4 mt-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search reports..." className="pl-9" />
                        </div>
                        <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                    </div>

                    <div className="space-y-4">
                        {REPORTS.map((report) => (
                            <Card key={report.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {report.target}
                                                <Badge variant="outline" className="text-xs">{report.type}</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Reported by <span className="font-medium text-foreground">{report.reporter}</span> • 2 hours ago
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" className="text-green-500 hover:text-green-600 hover:bg-green-50">
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Ban
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="users" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {USERS.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.username}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={user.role === 'pro' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={user.status === 'flagged' ? 'text-red-500 border-red-200' : 'text-green-500 border-green-200'}>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
