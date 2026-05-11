import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import RoleSelector from '../components/RoleSelector.jsx';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const result = await login(email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error || 'Invalid email or password' });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-[#1a2e2a] tracking-tight mb-2 font-heading">
          Welcome back
        </h2>
        <p className="text-[#64748b] text-[15px] font-medium">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <div className="mb-8">
         <RoleSelector value={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
             {errors.general}
          </div>
        )}

        
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-[#1a2e2a] ml-1">Username or email</label>
          <input 
            type="email" 
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-5 py-3.5 rounded-xl border bg-[#f8fafc] focus:bg-white focus:outline-none transition-all duration-300 text-[#1a2e2a] font-medium text-[14px] placeholder:text-[#94a3b8] ${
              errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-[#e2e8f0] focus:border-[#F5601A] focus:ring-4 focus:ring-orange-500/10'
            }`}
            required
            disabled={loading}
          />
          {errors.email && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-[#1a2e2a] ml-1">Password</label>
          <div className="relative">

            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-5 pr-12 py-3.5 rounded-xl border bg-[#f8fafc] focus:bg-white focus:outline-none transition-all duration-300 text-[#1a2e2a] font-medium text-[14px] placeholder:text-[#94a3b8] ${
                errors.password ? 'border-red-300 ring-4 ring-red-50' : 'border-[#e2e8f0] focus:border-[#F5601A] focus:ring-4 focus:ring-orange-500/10'
              }`}
              required
              disabled={loading}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1a2e2a] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] font-bold text-red-500 ml-1 mt-1">{errors.password}</p>}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#1a2e2a] text-white rounded-xl font-bold text-[15px] hover:bg-[#0f1d1a] transition-all duration-300 shadow-lg shadow-black/5 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[14px] text-[#64748b] font-medium">
          Are you new?{' '}
          <Link to="/signup" className="font-bold text-[#F5601A] hover:underline underline-offset-4">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};


export default Login;

