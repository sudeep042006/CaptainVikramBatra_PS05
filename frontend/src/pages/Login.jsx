import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false); // Quick toggle for demo
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (isRegister) {
            result = await supabase.auth.signUp({ email, password });
        } else {
            result = await supabase.auth.signInWithPassword({ email, password });
        }

        if (result.error) setError(result.error.message);
        else if (isRegister && !result.session) setError("Check your email for verification link!");

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neur-dark bg-grid-slate-800/[0.2]">
            <div className="bg-neur-panel p-8 rounded-xl shadow-2xl w-96 border border-slate-700 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">NeurCall</h2>
                    <p className="text-slate-400 text-sm mt-2">Intelligent Telephony Middleware</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 p-3 mb-4 rounded-lg text-sm text-center">{error}</div>}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Corporate Email"
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:border-neur-accent outline-none focus:ring-1 focus:ring-neur-accent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white focus:border-neur-accent outline-none focus:ring-1 focus:ring-neur-accent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition transform active:scale-95"
                    >
                        {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                    <button onClick={() => setIsRegister(!isRegister)} className="hover:text-cyan-400 underline">
                        {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
