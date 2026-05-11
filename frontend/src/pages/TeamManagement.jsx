import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Search,
  Filter,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import AddMemberModal from '../components/AddMemberModal';

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/users/members');
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-reveal-premium">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1 font-heading">Team Management</h1>
          <p className="text-[#64748B] text-[15px] font-medium">Manage your team members, roles, and permissions.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#10B981] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <UserPlus size={18} strokeWidth={2.5} /> Invite Member
        </button>
      </div>

      {/* Search & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-reveal-premium">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search members by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#10B981] transition-all shadow-sm"
          />
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl px-6 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-[#10B981]" />
            <span className="text-[12px] font-bold text-[#0F172A] uppercase tracking-wider">{members.length} Members</span>
          </div>
          <div className="h-4 w-px bg-[#E2E8F0]"></div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-blue-500" />
            <span className="text-[12px] font-bold text-[#0F172A] uppercase tracking-wider">{members.filter(m => m.role === 'admin').length} Admins</span>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-premium">
        {filteredMembers.map(member => (
          <div key={member._id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col items-center text-center space-y-4 hover:shadow-xl hover:shadow-black/5 transition-all group relative">
            <div className="absolute top-4 right-4">
               <button className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  <MoreVertical size={16} />
               </button>
            </div>
            
            <div className="relative">
               <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-2xl font-bold text-[#64748B] transition-all group-hover:bg-[#10B981] group-hover:text-white font-heading">
                  {member.name?.charAt(0).toUpperCase()}
               </div>
               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${member.role === 'admin' ? 'bg-blue-500' : 'bg-[#10B981]'}`}></div>
            </div>

            <div>
               <h3 className="text-[15px] font-bold text-[#0F172A] font-heading">{member.name}</h3>
               <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mt-0.5">{member.role}</p>
            </div>

            <div className="w-full pt-4 border-t border-[#F1F5F9] flex items-center justify-center gap-2 text-[#64748B]">
               <Mail size={14} />
               <span className="text-[12px] font-medium truncate max-w-[150px]">{member.email}</span>
            </div>
          </div>
        ))}
      </div>
      
      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onMemberAdded={fetchTeam}
      />
    </div>
  );
};

export default TeamManagement;
