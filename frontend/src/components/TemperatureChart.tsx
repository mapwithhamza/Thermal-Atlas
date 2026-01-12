import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import * as echarts from 'echarts';

interface TemperatureChartProps {
    data: {
        min: number;
        max: number;
        mean: number;
        std: number;
    } | null;
    loading?: boolean;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, loading }) => {
    // Generate dummy distribution based on stats (simplified Gaussian for viz)
    const chartOption = useMemo(() => {
        if (!data) return {};

        // Create 20 bins from min to max
        const bins = [];
        const step = (data.max - data.min) / 20;
        const values = [];

        for (let i = 0; i <= 20; i++) {
            const x = data.min + i * step;
            bins.push(x.toFixed(1));

            // Approximate normal distribution curve
            const exponent = -0.5 * Math.pow((x - data.mean) / data.std, 2);
            const y = (1 / (data.std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
            values.push(y);
        }

        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#475569',
                textStyle: { color: '#f1f5f9' },
                formatter: (params: any) => {
                    return `Temp: ${params[0].name}°C<br/>Density: ${params[0].value.toFixed(3)}`;
                }
            },
            grid: {
                left: 40,
                right: 20,
                top: 20,
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: bins,
                axisLine: { lineStyle: { color: '#94a3b8' } },
                axisLabel: { color: '#94a3b8', interval: 4 }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#334155' } },
                axisLabel: { show: false }
            },
            series: [
                {
                    data: values,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#3b82f6' }, // Blue
                            { offset: 0.5, color: '#f59e0b' }, // Orange
                            { offset: 1, color: '#ef4444' } // Red
                        ])
                    },
                    areaStyle: {
                        opacity: 0.3,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(239, 68, 68, 0.5)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
                        ])
                    }
                }
            ]
        };
    }, [data]);

    if (loading) {
        return (
            <div className="h-[250px] w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 animate-pulse">
                <div className="h-full w-full bg-slate-700/20 rounded-lg"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm"
        >
            <h3 className="text-sm font-semibold text-slate-300 mb-4 px-2">Temperature Distribution</h3>
            <div className="h-[250px] w-full">
                {data ? (
                    <ReactECharts
                        option={chartOption}
                        style={{ height: '100%', width: '100%' }}
                        theme="dark"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        No data available
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TemperatureChart;
