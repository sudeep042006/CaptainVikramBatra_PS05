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
            <div className="p-6 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
                {/* Header Stats for Company View */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-neur-panel border border-slate-700 p-4 rounded-lg">
                        <h4 className="text-slate-400 text-sm">Calls Today</h4>
                        <p className="text-2xl font-bold text-white">{stats.totalCalls}</p>
                    </div>
                    <div className="bg-neur-panel border border-slate-700 p-4 rounded-lg">
                        <h4 className="text-slate-400 text-sm">Avg Duration</h4>
                        <p className="text-2xl font-bold text-white">{stats.avgDuration}</p>
                    </div>
                    <div className="bg-neur-panel border border-slate-700 p-4 rounded-lg">
                        <h4 className="text-slate-400 text-sm">Sentiment</h4>
                        <p className="text-2xl font-bold text-green-400">{stats.sentiment}</p>
                    </div>
                    <div className="bg-neur-panel border border-slate-700 p-4 rounded-lg">
                        <h4 className="text-slate-400 text-sm">Status</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-3 h-3 rounded-full ${callStatus === 'active' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            <span className="font-semibold capitalize text-white">{callStatus}</span>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {callStatus === 'idle' && (
                            <button
                                onClick={() => setCallStatus('ringing')}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg border border-slate-600 transition"
                            >
                                Simulate Incoming Call
                            </button>
                        )}

                        {callStatus === 'ringing' && (
                            <div className="bg-yellow-900/20 border border-yellow-500/50 p-6 rounded-lg text-center animate-pulse">
                                <h2 className="text-2xl font-bold text-yellow-500 mb-4">Incoming Call: +1 (555) 012-3456</h2>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => setCallStatus('active')} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Accept</button>
                                    <button onClick={() => setCallStatus('handover_ai')} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold">Reject</button>
                                </div>
                            </div>
                        )}

                        <LiveTranscript transcripts={transcripts} />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-neur-panel p-6 rounded-lg border border-slate-700 h-full">
                            <h3 className="text-lg font-semibold text-slate-300 mb-4">AI Real-Time Insights</h3>
                            {insight ? (
                                <InsightCard insight={insight} onDismiss={() => setInsight(null)} />
                            ) : (
                                <div className="text-slate-500 italic text-center mt-10">Waiting for analysis...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AgentDashboard;
