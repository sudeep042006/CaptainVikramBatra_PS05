import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neur-dark">
            <div className="bg-neur-panel p-8 rounded-lg shadow-xl w-96 border border-slate-700">
                <h2 className="text-2xl font-bold text-neur-accent mb-6 text-center">NeurCall Access</h2>
                {error && <div className="bg-red-500/20 text-red-500 p-2 mb-4 rounded text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-neur-accent outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-neur-accent outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-neur-accent hover:bg-cyan-500 text-neur-dark font-bold py-2 rounded transition"
                    >
                        {loading ? 'Authenticating...' : 'Connect'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
