import axios from 'axios';

// Base URL from environment or default to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // Get temperature statistics
    getTemperatureStats: async () => {
        try {
            const response = await apiClient.get('/temperature/statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching temperature stats:', error);
            return null;
        }
    },

    // Get temperature at specific point
    getTemperatureAtPoint: async (lat: number, lon: number) => {
        try {
            const response = await apiClient.post('/temperature/point', { lat, lon });
            return response.data;
        } catch (error) {
            console.error('Error fetching temperature at point:', error);
            return null;
        }
    },

    // Get all heat islands
    getHeatIslands: async () => {
        try {
            const response = await apiClient.get('/heat-islands/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching heat islands:', error);
            return { total_count: 0, heat_islands: [], severity_distribution: {} };
        }
    },

    // Get heat island summary
    getHeatIslandSummary: async () => {
        try {
            const response = await apiClient.get('/heat-islands/summary');
            return response.data;
        } catch (error) {
            console.error('Error fetching heat island summary:', error);
            return null;
        }
    },

    // Get vegetation statistics
    getVegetationStats: async () => {
        try {
            const response = await apiClient.get('/vegetation/statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching vegetation stats:', error);
            return { mean: 0, vegetation_coverage_pct: 0 };
        }
    },

    // Get NDVI at point
    getNDVIAtPoint: async (lat: number, lon: number) => {
        try {
            const response = await apiClient.post('/vegetation/point', { lat, lon });
            return response.data;
        } catch (error) {
            console.error('Error fetching NDVI at point:', error);
            return null;
        }
    },

    // Get green space recommendations
    getRecommendations: async (limit = 10) => {
        try {
            const response = await apiClient.get(`/recommendations/green-spaces?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return { recommendations: [] };
        }
    }
};
