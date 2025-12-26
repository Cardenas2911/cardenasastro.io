import React, { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto'; // Removed for dynamic import

interface ChartRendererProps {
    type: any;
    data: any;
    options?: any;
    chartId?: string;
    height?: string;
    width?: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, options, chartId, height = "100%", width = "100%" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let chartInstance: any = null;

        const renderChart = async () => {
            // Dynamically import Chart.js to avoid SSR issues
            const { default: Chart } = await import('chart.js/auto');

            // Destroy existing chart to prevent duplicates if it exists from a previous render
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type,
                    data,
                    options: {
                        ...options,
                        responsive: true,
                        maintainAspectRatio: false, // Critical for Tailwind/Flex containers
                    }
                });
                chartInstanceRef.current = chartInstance;
            }
        };

        renderChart();

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [type, data, options, chartId]);

    return (
        <div style={{ height, width, position: 'relative' }}>
            <canvas
                ref={canvasRef}
                id={chartId}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </div>
    );
};

export default ChartRenderer;
