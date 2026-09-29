import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { FolderKanban, LayoutDashboard, Library, LogOut, MessageSquare, Radar, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const navItems = [
    { icon: LayoutDashboard, label: "لوحة المتابعة", href: "/dashboard" },
    { icon: FolderKanban, label: "مشاريعي", href: "/projects" },
    { icon: Zap, label: "تحدي أول بيعة", href: "/sprint" },
    { icon: MessageSquare, label: "المجتمع", href: "/community" },
    { icon: Radar, label: "الرادار", href: "/radar" },
    { icon: Library, label: "المكتبة", href: "/vault" },
    ...(user?.roles.includes("admin") ? [{ icon: ShieldCheck, label: "الإدارة", href: "/admin" }] : []),
  ];

  return <motion.aside className={cn("relative hidden h-screen w-64 shrink-0 flex-col border-r-2 border-white/10 bg-black rtl:border-l-2 rtl:border-r-0 md:flex", className)} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
    <div className="flex h-16 items-center border-b-2 border-white/10 px-6"><Link href="/" className="font-display text-xl font-black tracking-tighter uppercase">أول بيعة</Link></div>
    <nav aria-label="التنقل" className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
      {navItems.map(({ icon: Icon, label, href }) => <Link key={href} href={href} aria-current={location === href ? "page" : undefined} className={cn("relative flex items-center gap-3 border-2 px-4 py-3 text-sm font-bold tracking-wider transition-all duration-200", location === href ? "border-blue-400 bg-blue-400/10 text-blue-400" : "border-white/20 text-muted-foreground hover:border-white hover:text-white")}>
        <Icon className="h-5 w-5" aria-hidden="true" /><span>{label}</span>{location === href && <motion.span layoutId="activeNav" className="absolute left-0 h-8 w-1 bg-blue-400 rtl:right-0 rtl:left-auto" />}
      </Link>)}
    </nav>
    <div className="border-t-2 border-white/10 p-4">
      {user ? <div className="space-y-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center border-2 border-white/40 bg-black text-xs font-black">{(user.displayName || user.email || "U").slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">@{user.displayName || "user"}</p><p className="truncate font-mono text-xs text-muted-foreground">{user.email}</p></div></div>
        <Button variant="outline" className="w-full border-2 border-white/20 text-xs font-bold tracking-wider hover:border-white hover:bg-white hover:text-black" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}><LogOut className="ml-2 h-4 w-4" />יציאה</Button>
      </div> : <Button asChild className="w-full bg-white font-bold tracking-widest text-black hover:bg-white/90"><Link href="/auth">دخول</Link></Button>}
    </div>
  </motion.aside>;
}
