import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
    children: React.ReactNode[];
    className?: string;
    columns?: {
        default: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    gap?: number;
}

export function MasonryGrid({
    children,
    className,
    columns = { default: 1, sm: 2, md: 3, lg: 4 },
    gap = 24
}: MasonryGridProps) {
    const [columnCount, setColumnCount] = useState(columns.default);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width >= 1280 && columns.xl) setColumnCount(columns.xl);
            else if (width >= 1024 && columns.lg) setColumnCount(columns.lg);
            else if (width >= 768 && columns.md) setColumnCount(columns.md);
            else if (width >= 640 && columns.sm) setColumnCount(columns.sm);
            else setColumnCount(columns.default);
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, [columns]);

    // Distribute children into columns
    const columnWrapper: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);

    React.Children.forEach(children, (child, index) => {
        columnWrapper[index % columnCount].push(child);
    });

    return (
        <div
            ref={containerRef}
            className={cn("flex w-full", className)}
            style={{ gap: `${gap}px` }}
        >
            {columnWrapper.map((col, index) => (
                <div
                    key={index}
                    className="flex flex-col flex-1"
                    style={{ gap: `${gap}px` }}
                >
                    {col}
                </div>
            ))}
        </div>
    );
}
