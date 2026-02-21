import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Simple in-memory cache for GET requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add a request interceptor to attach the token and handle caching
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Check cache for GET requests
        if (config.method === 'get' && config.url) {
            const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
            const cached = requestCache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                // Return cached data
                config.adapter = () => Promise.resolve({
                    data: cached.data,
                    status: 200,
                    statusText: 'OK (cached)',
                    headers: {},
                    config,
                });
            }
        }

        console.log(`Making request to: ${config.baseURL || ''}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to cache successful GET requests
api.interceptors.response.use(
    (response) => {
        // Cache successful GET requests
        if (response.config.method === 'get' && response.config.url) {
            const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
            requestCache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now(),
            });
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
