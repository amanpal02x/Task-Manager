import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  ChevronRight,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const settingsTabs = [
    { id: 'profile', label: 'Profile Information', description: 'Update your personal details', icon: User },
    { id: 'security', label: 'Security & Password', description: 'Manage your account security', icon: Shield },
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.patch('/users/profile', { name, email });
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      console.error('Profile update error:', err.response?.data);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error('Please fill in all password fields');
    }
    setSecurityLoading(true);
    try {
      const res = await api.patch('/users/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      console.error('Password change error:', err.response?.data);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to change password';
      toast.error(msg);
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="animate-reveal-premium">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1 font-heading">Settings</h1>
        <p className="text-[#64748B] text-[15px] font-medium">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar - Navigation Pills */}
        <aside className="w-full lg:w-80 space-y-3 animate-reveal-premium">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border text-left ${
                  isActive 
                    ? 'bg-white border-[#10B981] shadow-lg shadow-emerald-500/5' 
                    : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#10B981]/50 hover:bg-[#F8FAFC]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F8FAFC] text-[#64748B]'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className={`text-[14px] font-bold ${isActive ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{tab.label}</p>
                  <p className="text-[11px] font-medium text-[#94A3B8]">{tab.description}</p>
                </div>
                <ChevronRight size={16} className={`transition-transform ${isActive ? 'text-[#10B981] rotate-90' : 'text-[#E2E8F0]'}`} />
              </button>
            );
          })}
        </aside>

        {/* Right Content - Settings Form */}
        <div className="flex-1 w-full animate-reveal-premium">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm min-h-[400px]">
             {activeSection === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="relative">
                         <div className="w-24 h-24 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-4xl font-bold text-[#64748B] font-heading">
                            {user?.name?.charAt(0).toUpperCase()}
                         </div>
                         <button type="button" className="absolute -bottom-2 -right-2 bg-[#10B981] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-all border-2 border-white">
                            <Camera size={16} />
                         </button>
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-[#0F172A] font-heading">{user?.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <Shield size={14} className="text-[#10B981]" />
                            <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">{user?.role}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#0F172A] ml-1">Full Name</label>
                         <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
                            <input 
                               type="text" 
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-[14px] font-semibold focus:outline-none focus:border-[#10B981] focus:bg-white transition-all text-[#0F172A]"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#0F172A] ml-1">Email Address</label>
                         <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
                            <input 
                               type="email" 
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-[14px] font-semibold focus:outline-none focus:border-[#10B981] focus:bg-white transition-all text-[#0F172A]"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-[#F1F5F9] flex justify-end">
                      <button 
                        type="submit"
                        disabled={profileLoading}
                        className="bg-[#10B981] text-white px-8 py-3 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                      >
                         {profileLoading ? 'Updating...' : 'Save Changes'}
                      </button>
                   </div>
                </form>
             )}

             {activeSection === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-8 animate-reveal-premium">
                   <div className="max-w-md space-y-6">
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#0F172A] ml-1">Current Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input 
                               type="password" 
                               placeholder="••••••••"
                               value={currentPassword}
                               onChange={(e) => setCurrentPassword(e.target.value)}
                               className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-[14px] font-semibold focus:outline-none focus:border-[#10B981] focus:bg-white transition-all text-[#0F172A]"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#0F172A] ml-1">New Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                            <input 
                               type="password" 
                               placeholder="••••••••"
                               value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}
                               className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-[14px] font-semibold focus:outline-none focus:border-[#10B981] focus:bg-white transition-all text-[#0F172A]"
                            />
                         </div>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-[#F1F5F9] flex justify-end">
                      <button 
                        type="submit"
                        disabled={securityLoading}
                        className="bg-[#10B981] text-white px-8 py-3 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                      >
                         {securityLoading ? 'Updating...' : 'Update Password'}
                      </button>
                   </div>
                </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
