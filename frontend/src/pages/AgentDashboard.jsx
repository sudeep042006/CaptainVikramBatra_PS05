import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { fetchDashboardStats } from '../services/api';
import Layout from '../components/Layout/Layout';
import LiveTranscript from '../components/Dashboard/LiveTranscript';
import InsightCard from '../components/Dashboard/InsightCard';

const AgentDashboard = () => {
    const socket = useSocket();
    const [transcripts, setTranscripts] = useState([]);
    const [insight, setInsight] = useState(null);
    const [callStatus, setCallStatus] = useState('idle');
    const [timer, setTimer] = useState(10);
    const [stats, setStats] = useState({
        totalCalls: 0,
        agentsOnline: 0,
        avgDuration: '0m 0s',
        sentiment: 'Neutral'
    });

    // Fetch Stats on Mount
    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchDashboardStats();
            if (data) {
                // Determine dominant sentiment or just use mock for now if aggregation not ready
                setStats({
                    totalCalls: data.totalCalls || 0,
                    agentsOnline: data.agentsOnline || 1,
                    avgDuration: '3m 12s', // Mock or calculate from data if available
                    sentiment: 'Positive' // Placeholder logic
                });
            }
        };
        loadStats();
    }, []);

    // Socket Logic
    useEffect(() => {
        if (!socket) return;

        socket.on('transcript', (data) => {
            if (callStatus === 'idle') setCallStatus('active');
            // Handle both string and object data types from backend
            const text = typeof data === 'string' ? data : data.text;
            setTranscripts(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
        });

        socket.on('insight', (data) => {
            console.log("Insight Received:", data);
            setInsight(data);
        });

        // Optional: Listen for call ended event

        return () => {
            socket.off('transcript');
            socket.off('insight');
        };
    }, [socket, callStatus]);

    // Timer Logic for Sim
    useEffect(() => {
        if (callStatus === 'ringing') {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCallStatus('handover_ai');
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [callStatus]);

    return (
        <Layout>
            <div className="h-full flex flex-col">
                {/* Header Stats for Company View */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="neur-panel p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                        </div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Calls Today</h4>
                        <p className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">{stats.totalCalls}</p>
                        <div className="text-xs text-emerald-400 font-medium mt-auto flex items-center gap-1">
                            <span className="bg-emerald-400/10 px-1.5 py-0.5 rounded">↑ 12%</span> <span className="text-slate-500 font-normal">vs yesterday</span>
                        </div>
                    </div>

                    <div className="neur-panel p-6 flex flex-col justify-between h-32">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Duration</h4>
                        <p className="text-3xl font-bold text-white mt-1 font-mono tracking-tight">{stats.avgDuration}</p>
                        <div className="w-full bg-slate-800 rounded-full h-1 mt-auto">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '65%' }}></div>
                        </div>
                    </div>

                    <div className="neur-panel p-6 flex flex-col justify-between h-32">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sentiment</h4>
                        <p className="text-3xl font-bold text-violet-400 mt-1 tracking-tight">{stats.sentiment}</p>
                        <div className="text-xs text-slate-500 mt-auto">Based on last 10 calls</div>
                    </div>

                    <div className="neur-panel p-6 flex flex-col justify-between h-32 border-l-2 border-l-violet-500">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">System Status</h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${callStatus === 'active' ? 'bg-emerald-500 text-emerald-500' : 'bg-slate-600 text-slate-600'}`}></span>
                            <span className="font-bold text-lg text-white capitalize">{callStatus === 'active' ? 'Live Call' : callStatus}</span>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {callStatus === 'idle' && (
                            <div className="neur-panel p-8 flex flex-col items-center justify-center text-center h-64 border-2 border-dashed border-slate-700/50 bg-slate-900/40">
                                <div className="bg-slate-800 p-4 rounded-full mb-5 shadow-inner">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Ready to Receive Calls</h3>
                                <p className="text-slate-400 max-w-sm mb-8 text-sm">Waiting for incoming connection stream from Twilio...</p>
                                <button
                                    onClick={() => setCallStatus('ringing')}
                                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition shadow-lg"
                                >
                                    Force Simulation
                                </button>
                            </div>
                        )}

                        {callStatus === 'ringing' && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-2xl text-center shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center h-64">
                                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 animate-pulse">
                                    <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Incoming Call...</h2>
                                <h3 className="text-lg text-amber-500 mb-8 font-mono tracking-wider">+1 (555) 012-3456</h3>

                                <div className="flex gap-4">
                                    <button onClick={() => setCallStatus('active')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105 flex items-center gap-2">
                                        Accept Call
                                    </button>
                                    <button onClick={() => setCallStatus('handover_ai')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-transform hover:scale-105">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        )}

                        <LiveTranscript transcripts={transcripts} />
                    </div>

                    <div className="space-y-6">
                        <div className="neur-panel p-6 h-full flex flex-col">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_10px_currentColor]"></span>
                                AI Real-Time Insights
                            </h3>
                            {insight ? (
                                <InsightCard insight={insight} onDismiss={() => setInsight(null)} />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                                    <p className="text-sm">No insights detected yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AgentDashboard;
