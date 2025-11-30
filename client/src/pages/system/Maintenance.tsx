import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function Maintenance() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
            <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
                <Wrench className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">UNDER MAINTENANCE</h1>
            <p className="text-xl text-muted-foreground font-mono mb-8 max-w-md">
                WE ARE CURRENTLY UPGRADING OUR SYSTEMS. PLEASE CHECK BACK LATER.
            </p>
        </div>
    );
}
