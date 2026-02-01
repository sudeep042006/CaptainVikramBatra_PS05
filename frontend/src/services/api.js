import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Ensure this matches your backend PORT
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add Supabase Token (if we implement protection later)
api.interceptors.request.use(async (config) => {
    // const { data } = await supabase.auth.getSession();
    // if (data.session) {
    //     config.headers.Authorization = `Bearer ${data.session.access_token}`;
    // }
    return config;
});

export const fetchDashboardStats = async () => {
    try {
        const response = await api.get('/agent/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Stats:", error);
        return null;
    }
};

export const fetchCallHistory = async () => {
    try {
        const response = await api.get('/agent/dashboard/calls');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch History:", error);
        return [];
    }
};

export default api;
