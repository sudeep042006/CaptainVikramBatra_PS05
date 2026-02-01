import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { session, signOut } = useAuth();

    // Simple Navbar + Content Layout
    return (
        <div className="flex flex-col h-screen bg-neur-dark text-slate-100">
            {/* Navbar */}
            <header className="bg-neur-panel border-b border-slate-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg"></div>
                    <span className="text-xl font-bold tracking-tight">NeurCall <span className="text-xs font-normal text-slate-400">Enterprise</span></span>
                </div>

                {session && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">{session.user.email}</span>
                        <button
                            onClick={signOut}
                            className="text-xs border border-slate-600 px-3 py-1 rounded hover:bg-slate-700 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-0">
                {children}
            </main>
        </div>
    );
};

export default Layout;
