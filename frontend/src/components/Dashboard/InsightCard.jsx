import React from 'react';

const InsightCard = ({ insight, onDismiss }) => {
    if (!insight) return null;

    const isUrgent = insight.type === 'red_card';

    return (
        <div className={`fixed top-20 right-10 w-80 p-5 rounded-xl shadow-2xl transition-all transform animate-slide-in z-50 
            ${isUrgent ? 'bg-red-900/90 border-2 border-red-500' : 'bg-neur-panel border border-neur-accent'}`}>
            <div className="flex justify-between items-start">
                <h3 className={`font-bold text-lg ${isUrgent ? 'text-white' : 'text-neur-accent'}`}>
                    {insight.title || 'Insight'}
                </h3>
                <button onClick={onDismiss} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <p className="mt-2 text-slate-200">{insight.message}</p>

            {insight.data && (
                <div className="mt-3 bg-black/30 p-2 rounded text-xs font-mono text-slate-300">
                    <pre>{JSON.stringify(insight.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default InsightCard;
