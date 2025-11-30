import { TechShell } from "@/components/layout/TechShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-3xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">SETTINGS</h1>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold uppercase tracking-wider">Profile</h2>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Display Name</Label>
                                    <Input defaultValue="PromptWizard" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Bio</Label>
                                    <Input defaultValue="Building the future of AI art." />
                                </div>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold uppercase tracking-wider">Notifications</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Email Notifications</Label>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>New Followers</Label>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Weekly Digest</Label>
                                    <Switch />
                                </div>
                            </div>
                        </section>

                        <Separator />

                        <div className="pt-4">
                            <Button size="lg" className="w-full md:w-auto">SAVE CHANGES</Button>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
