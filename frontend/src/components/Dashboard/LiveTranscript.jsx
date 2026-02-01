import React, { useEffect, useRef } from 'react';

const LiveTranscript = ({ transcripts }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts]);

    return (
        <div className="bg-neur-panel rounded-lg p-6 h-96 flex flex-col shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-neur-accent">Live Transcript</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-600">
                {transcripts.length === 0 && (
                    <p className="text-slate-500 italic">Waiting for call audio...</p>
                )}
                {transcripts.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'ai'
                            ? 'bg-slate-700 self-end ml-auto text-right'
                            : 'bg-indigo-900/50 self-start text-left'
                        }`}>
                        <p className="text-sm text-slate-300">{msg.text}</p>
                        <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default LiveTranscript;
