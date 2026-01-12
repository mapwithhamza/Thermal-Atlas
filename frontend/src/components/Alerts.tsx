import React from 'react';
import { motion } from 'framer-motion';
import { ThermometerSun, Flame, Info, AlertTriangle, Wind, Droplets } from 'lucide-react';

const Alerts: React.FC = () => {
    const alerts = [
        {
            id: 1,
            title: "Extreme Heat Warning",
            location: "San Fernando Valley",
            value: "+42°C",
            severity: "Critical",
            time: "Updated 10m ago",
            icon: ThermometerSun,
            color: "red"
        },
        {
            id: 2,
            title: "Fire Risk Elevated",
            location: "Griffith Park Area",
            value: "High Risk",
            severity: "Warning",
            time: "Updated 45m ago",
            icon: Flame,
            color: "orange"
        },
        {
            id: 3,
            title: "Air Quality Alert",
            location: "Downtown Los Angeles",
            value: "AQI 145",
            severity: "Caution",
            time: "Updated 1h ago",
            icon: Wind,
            color: "yellow"
        },
        {
            id: 4,
            title: "Cooling Centers Open",
            location: "Metro LA District",
            value: "Active",
            severity: "Info",
            time: "Live Feed",
            icon: Info,
            color: "blue"
        },
        {
            id: 5,
            title: "High Humidity Levels",
            location: "Santa Monica / Coastal",
            value: "88%",
            severity: "Monitor",
            time: "Updated 2h ago",
            icon: Droplets,
            color: "cyan"
        }
    ];

    return (
        <div className="h-full w-full bg-slate-950 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <div className="max-w-4xl mx-auto pt-4">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Active Alerts</h1>
                        <p className="text-slate-400 text-lg">Real-time environmental hazards and system notifications.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-red-400 text-sm font-bold uppercase tracking-wide">Live Feed</span>
                    </div>
                </div>

                <div className="grid gap-5">
                    {alerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group relative overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                        >
                            {/* Side Color Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${alert.color}-500`} />

                            {/* Ambient Glow */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-${alert.color}-500/5 rounded-full blur-3xl group-hover:bg-${alert.color}-500/10 transition-colors`} />

                            <div className="flex items-start gap-6 relative z-10">
                                {/* Icon Box */}
                                <div className={`p-4 rounded-xl bg-${alert.color}-500/10 text-${alert.color}-500 border border-${alert.color}-500/20 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                                    <alert.icon size={28} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                                            {alert.title}
                                        </h3>
                                        <div className="text-right">
                                            <span className={`block text-lg font-bold text-${alert.color}-400 mb-1`}>{alert.value}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-slate-400 font-medium flex items-center gap-1.5">
                                                <AlertTriangle size={14} className="text-slate-500" />
                                                {alert.location}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${alert.color}-500/10 text-${alert.color}-400 border border-${alert.color}-500/20`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">{alert.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Alerts;
