// Define your Backend URL
const API_BASE_URL = "http://localhost:8080/api/v1"; //example

export const authService = {

    // Fetch Branch List from Backend
    getBranches: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/branches`);

            if (!response.ok) {
                throw new Error("Failed to fetch branch list");
            }

            // Returns the array of branches: [{ id: 1, name: "Colombo" }, ...]
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error; // Re-throw so the UI can show an alert if needed
        }
    },

    // Send Registration Data to Backend
    registerUser: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Converts your JS Object into JSON string for the server
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                // If backend returns 400/500, throw the specific error message
                throw new Error(data.message || "Registration failed");
            }

            return data; // Success response
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Login User
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            return data; // Should contain token and user info
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Forgot Password - submit reset request to admin for approval
    forgotPassword: async (requestData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit password reset request");
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};