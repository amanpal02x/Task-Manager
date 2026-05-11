import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FolderKanban, 
  MoreVertical,
  Filter,
  ArrowUpDown,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal';
import { toast } from 'react-hot-toast';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

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
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1 font-heading">Projects</h1>
          <p className="text-[#64748B] text-[15px] font-medium">Manage and track all your active team projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#10B981] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} strokeWidth={2.5} /> New Project
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 animate-reveal-premium">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#10B981] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setSortBy(sortBy === 'newest' ? 'name' : sortBy === 'name' ? 'oldest' : 'newest')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all shadow-sm"
          >
            <ArrowUpDown size={16} /> Sort: {sortBy}
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-premium">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(proj => (
            <div 
              key={proj._id} 
              onClick={() => navigate(`/projects/${proj._id}`)}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl flex items-center justify-center text-[#64748B] group-hover:bg-[#10B981] group-hover:text-white transition-all">
                  <FolderKanban size={20} />
                </div>
                <ArrowUpRight size={18} className="text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-[15px] font-bold text-[#0F172A] truncate mb-1">{proj.title}</h3>
              <p className="text-[12px] text-[#64748B] line-clamp-2 min-h-[32px] leading-relaxed mb-4">{proj.description || 'No description provided'}</p>
              
              <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Progress</span>
                  <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">{proj.taskStats?.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-[#10B981] rounded-full transition-all duration-700"
                      style={{ width: `${proj.taskStats?.progress || 0}%` }}
                   ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-[#E2E8F0] border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-[#94A3B8] gap-3">
             <FolderKanban size={40} strokeWidth={1.5} />
             <p className="text-sm font-semibold">No projects match your search</p>
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={fetchProjects}
      />
    </div>
  );
};

export default Projects;
