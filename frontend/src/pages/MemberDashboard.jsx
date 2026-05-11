import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  Activity,
  Briefcase,
  ListTodo,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/member');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const { stats, activeProjects, recentTasks, activities } = data || {};

  const statsConfig = [
    { 
      label: 'Assigned Projects', 
      value: stats?.assignedProjectsCount || 0, 
      icon: Briefcase, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Pending Tasks', 
      value: stats?.pendingTasks || 0, 
      icon: ListTodo, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      label: 'Completion Rate', 
      value: stats?.totalAssignedTasks > 0 
        ? `${Math.round((stats?.completedTasks / stats?.totalAssignedTasks) * 100)}%` 
        : '0%', 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tasks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-premium">
            {recentTasks?.length > 0 ? (
              recentTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onClick={() => setSelectedTask(task)} 
                />
              ))
            ) : (
              <div className="col-span-full bg-white border border-[#E2E8F0] border-dashed rounded-2xl h-48 flex flex-col items-center justify-center text-[#94A3B8] gap-3">
                 <CheckCircle2 size={32} strokeWidth={1.5} />
                 <p className="text-sm font-semibold">No pending tasks for you</p>
              </div>
            )}
          </div>
        );
      case 'Projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-premium">
            {activeProjects?.map(proj => (
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
                <h3 className="text-[15px] font-bold text-[#0F172A] truncate mb-4 font-heading">{proj.title}</h3>
                
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
            ))}
          </div>
        );
      case 'Activity':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 animate-reveal-premium">
            <div className="space-y-6">
              {activities?.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#64748B] group-hover:bg-[#10B981] group-hover:text-white transition-all flex-shrink-0">
                      <Activity size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#059669] transition-colors">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-[#94A3B8]" />
                        <span className="text-[12px] font-medium text-[#94A3B8]">{new Date(activity.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold text-[#94A3B8]">No recent activity to show</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="animate-reveal-premium">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1 font-heading">
          Hello, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[#64748B] text-[15px] font-medium">
          You have <span className="text-[#0F172A] font-bold">{stats?.pendingTasks || 0}</span> tasks waiting for your attention today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-reveal-premium">
        {statsConfig.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-[#E2E8F0] p-5 rounded-2xl group hover:border-[#10B981]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-xl font-extrabold text-[#0F172A] font-heading">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-8 border-b border-[#E2E8F0] animate-reveal-premium">
        {['Tasks', 'Projects', 'Activity'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[14px] font-bold transition-all relative ${
              activeTab === tab 
                ? 'text-[#10B981]' 
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchDashboardData}
        onDelete={async (id) => {
          try {
            await api.delete(`/tasks/${id}`);
            setSelectedTask(null);
            fetchDashboardData();
            toast.success('Task deleted');
          } catch (err) {
            toast.error('Failed to delete');
          }
        }}
      />
    </div>
  );
};

export default MemberDashboard;
