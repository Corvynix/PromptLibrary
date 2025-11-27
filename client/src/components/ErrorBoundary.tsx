import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="text-center space-y-6 max-w-md">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-red-500/10 border-2 border-red-500/20">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight uppercase">
                                SOMETHING WENT WRONG
                            </h2>
                            <p className="text-muted-foreground font-mono text-sm">
                                An unexpected error occurred. Please try again.
                            </p>
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 p-4 bg-muted rounded-2xl text-xs overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                onClick={this.handleReset}
                                className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-bold tracking-widest rounded-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                TRY AGAIN
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => (window.location.href = "/")}
                                className="w-full sm:w-auto border-2 border-white/20 hover:border-white font-bold tracking-widest rounded-full"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                GO HOME
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
