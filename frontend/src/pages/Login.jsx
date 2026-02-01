import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('demo@neurcall.ai');
    const [password, setPassword] = useState('demo123');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            login(email);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-[100px]"></div>

            <div className="neur-panel p-10 w-[420px] relative z-10 backdrop-blur-xl bg-white/80">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-2">
                        {/* Logo Icon */}
                        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">NeurCall</h1>
                    </div>
                </div>

                <div className="bg-violet-50 text-violet-600 px-4 py-2 rounded-lg text-xs text-center mb-6 border border-violet-100">
                    Demo Mode Active
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 ml-1 uppercase">Email Address</label>
                        <input
                            type="email"
                            className="neur-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 ml-1 uppercase">Password</label>
                        <input
                            type="password"
                            className="neur-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button disabled={loading} className="neur-btn-primary mt-4">
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>

                    <div className="flex justify-between text-xs text-slate-400 mt-4 px-1">
                        <span className="cursor-pointer hover:text-violet-500">Forgot Password?</span>
                        <span className="cursor-pointer hover:text-violet-500">Sign Up</span>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">Powered by NeurCall</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
