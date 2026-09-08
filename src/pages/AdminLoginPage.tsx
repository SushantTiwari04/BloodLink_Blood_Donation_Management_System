import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginPageProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export default function AdminLoginPage({ onLogin, onNavigate }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-operations`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'verify-admin',
          payload: {
            username: username.trim(),
            password: password.trim(),
          },
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.valid) {
        onLogin();
        onNavigate('admin');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setLoading(false);
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-8 text-center">
            <div className="bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-gray-400 text-sm">BloodLink Management System</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-gray-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-gray-800 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white font-semibold py-4 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-xs text-gray-500">Default credentials:</p>
              <p className="text-sm font-mono text-gray-700 mt-1">Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>admin123</strong></p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Not an admin?{' '}
          <button onClick={() => onNavigate('home')} className="text-red-600 hover:underline font-medium">
            Go back home
          </button>
        </p>
      </div>
    </div>
  );
}
