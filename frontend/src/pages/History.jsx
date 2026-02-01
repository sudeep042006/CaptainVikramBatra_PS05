import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';

const History = () => {
    const [calls, setCalls] = useState([]);

    useEffect(() => {
        // Fetch from backend (placeholder endpoint)
        // axios.get('http://localhost:5000/api/calls/history').then(res => setCalls(res.data));

        // Mock Data for UI
        setCalls([
            { id: 1, caller: "+15550123", intent: "support", duration: "2m 30s", date: "2023-10-27 10:30 AM", sentiment: "Neutral" },
            { id: 2, caller: "+15550456", intent: "sales", duration: "5m 12s", date: "2023-10-27 11:15 AM", sentiment: "Positive" },
            { id: 3, caller: "+15550789", intent: "billing", duration: "1m 45s", date: "2023-10-27 12:00 PM", sentiment: "Negative" },
        ]);
    }, []);

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-slate-100">Call History</h1>

                <div className="bg-neur-panel rounded-lg border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800 text-slate-200 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Caller</th>
                                <th className="px-6 py-4">Intent</th>
                                <th className="px-6 py-4">Status/Sentiment</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {calls.map((call) => (
                                <tr key={call.id} className="hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-mono text-slate-300">{call.caller}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-indigo-900 text-indigo-300 text-xs">
                                            {call.intent}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold ${call.sentiment === 'Positive' ? 'text-green-400' :
                                                call.sentiment === 'Negative' ? 'text-red-400' : 'text-yellow-400'
                                            }`}>
                                            {call.sentiment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{call.duration}</td>
                                    <td className="px-6 py-4">{call.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default History;
