export default function Notifications() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-4xl font-black tracking-tighter mb-4">KORIQ</div>
        <h1 className="text-2xl font-bold mb-4">Coming soon.</h1>
        <p className="text-muted-foreground mb-6">This section is available to enrolled students. Applications for Cohort 7 are open at <a href="/apply" className="underline">/apply</a>.</p>
        <a href="/" className="text-sm font-mono text-muted-foreground hover:text-foreground">← Back to home</a>
      </div>
    </div>
  );
}
