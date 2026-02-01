import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import AgentDashboard from './pages/AgentDashboard';
import Login from './pages/Login';
import History from './pages/History'; // Import History

const Main = () => {
    const { session } = useAuth();

    if (!session) {
        return <Login />;
    }

    // Simple manual routing for demo (Production would use react-router-dom)
    // For now, defaulting to Dashboard, but if we had router logic we'd put it here.
    return (
        <SocketProvider>
            <AgentDashboard />
        </SocketProvider>
    );
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen font-sans">
                <Main />
            </div>
        </AuthProvider>
    );
}

export default App;
