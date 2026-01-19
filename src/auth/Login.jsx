import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // API Call to get Token
      // Adjust URL based on your actual backend end point
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      // Store in LocalStorage
      localStorage.setItem('token', token);
      if(user) localStorage.setItem('user', JSON.stringify(user));

      // Navigate to POS
      navigate('/pos');
      
    } catch (err) {
      setError('Invalid credentials or server error');
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">ROCS <span className="text-blue-200">POS</span></h1>
            <p className="text-blue-100 font-medium">Retail Operation Control System</p>
        </div>

        {/* Form */}
        <div className="p-8">
            <h2 className="text-xl font-bold text-slate-700 mb-6 text-center">Sign In to Terminal</h2>
            
            {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded text-sm font-bold border border-red-100 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                    <div className="flex items-center border border-slate-300 rounded-lg px-3 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <User className="w-5 h-5 text-slate-400 mr-3" />
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full font-semibold text-slate-700 focus:outline-none" 
                            placeholder="Enter username" 
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                    <div className="flex items-center border border-slate-300 rounded-lg px-3 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <Lock className="w-5 h-5 text-slate-400 mr-3" />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full font-semibold text-slate-700 focus:outline-none" 
                            placeholder="••••••••" 
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg shadow-lg uppercase tracking-widest text-sm transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Authenticating..." : "Access Terminal"}
                </button>
            </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-mono">System v1.0.0 • NSBM Project</p>
        </div>
      </div>
    </div>
  );
}
