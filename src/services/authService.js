// Mock Service for Authentication & Registration
export const authService = {
    
    // 1. Fetch Branches (Mocking Backend List)
    getBranches: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: "BR01", name: "Colombo Main - HQ" },
                    { id: "BR02", name: "Kandy City Centre" },
                    { id: "BR03", name: "Galle Fort Branch" },
                    { id: "BR04", name: "Negombo Outlet" }
                ]);
            }, 800); // Simulate network delay
        });
    },

    // 2. Register User
    registerUser: (userData) => {
        console.log("Sending Registration to Backend:", userData);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate Success
                resolve({ success: true, message: "User registered successfully." });
            }, 1500);
        });
    }
};