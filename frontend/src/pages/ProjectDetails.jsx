import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   Plus,
   Users,
   Clock,
   CheckCircle2,
   ArrowLeft,
   MoreVertical,
   Activity,
   LayoutGrid,
   FolderKanban,
   ArrowUpRight,
   Settings,
   UserPlus
} from 'lucide-react';
import api from '../services/api';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
   const { user } = useAuth();
   const { id } = useParams();
   const navigate = useNavigate();
   const [project, setProject] = useState(null);
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedTask, setSelectedTask] = useState(null);
   const [quickAddStatus, setQuickAddStatus] = useState(null);

   const fetchProjectDetails = async () => {
      try {
         const [projRes, tasksRes] = await Promise.all([
            api.get(`/projects/${id}`),
            api.get(`/tasks/project/${id}`)
         ]);
         if (projRes.data.success) setProject(projRes.data.data);
         if (tasksRes.data.success) setTasks(tasksRes.data.data);
      } catch (err) {
         console.error(err);
         toast.error('Failed to load project details');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProjectDetails();
   }, [id]);

   const handleTaskDelete = async (taskId) => {
      try {
         const res = await api.delete(`/tasks/${taskId}`);
         if (res.data.success) {
            toast.success('Task deleted successfully');
            setSelectedTask(null);
            fetchProjectDetails();
         }
      } catch (err) {
         toast.error('Failed to delete task');
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
         </div>
      );
   }

   const statsConfig = [
      { label: 'Total Tasks', value: tasks.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'Activity', value: 'High', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
   ];

   const statuses = [
      { id: 'todo', label: 'To Do', color: 'bg-[#94A3B8]' },
      { id: 'in-progress', label: 'In Progress', color: 'bg-orange-500' },
      { id: 'review', label: 'In Review', color: 'bg-blue-500' },
      { id: 'completed', label: 'Completed', color: 'bg-[#10B981]' }
   ];

   return (
      <div className="space-y-8">
         {/* Navigation & Header */}
         <div className="space-y-6">
            <button
               onClick={() => navigate('/projects')}
               className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] font-bold text-[13px] transition-all group"
            >
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-reveal-premium">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#10B981] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                     <FolderKanban size={24} />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">{project?.title}</h1>
                     <p className="text-[#64748B] text-[14px] font-medium mt-0.5">{project?.description || 'No description provided'}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                     {project?.members?.slice(0, 5).map((m, i) => (
                        <div key={i} className="w-9 h-9 rounded-xl border-2 border-white bg-[#F8FAFC] flex items-center justify-center text-[11px] font-bold text-[#64748B] shadow-sm" title={m.name}>
                           {m.name?.charAt(0).toUpperCase()}
                        </div>
                     ))}
                     {project?.members?.length > 5 && (
                        <div className="w-9 h-9 rounded-xl border-2 border-white bg-[#0F172A] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                           +{project.members.length - 5}
                        </div>
                     )}
                  </div>
                  <button
                     onClick={() => setIsModalOpen(true)}
                     className="bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                     <Plus size={18} /> Add Task
                  </button>
                  <button className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#64748B] hover:bg-[#F8FAFC] transition-all shadow-sm">
                     <Settings size={18} />
                  </button>
               </div>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-reveal-premium">
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

         {/* Kanban Board */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-reveal-premium">
            {statuses.map((status) => (
               <div key={status.id} className="space-y-4">
                  <div className="flex items-center justify-between px-3 py-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${status.color}`}></div>
                        <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">{status.label}</span>
                     </div>
                     <span className="text-[10px] font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-lg border border-[#F1F5F9]">
                        {tasks.filter(t => t.status === (status.id === 'todo' ? 'pending' : status.id)).length}
                     </span>
                  </div>

                  <div className="space-y-4 min-h-[500px]">
                     {tasks.filter(t => t.status === (status.id === 'todo' ? 'pending' : status.id)).map(task => (
                        <TaskCard
                           key={task._id}
                           task={task}
                           onClick={() => setSelectedTask(task)}
                        />
                     ))}
                     
                     {tasks.filter(t => t.status === (status.id === 'todo' ? 'pending' : status.id)).length === 0 && (
                        <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl h-32 flex flex-col items-center justify-center text-[#94A3B8] gap-2 opacity-50">
                           <Plus size={20} />
                           <p className="text-[10px] font-bold uppercase">No tasks</p>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         <CreateTaskModal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setQuickAddStatus(null);
            }}
            projectId={id}
            initialStatus={quickAddStatus}
            onTaskCreated={fetchProjectDetails}
         />
         <TaskDetailsDrawer
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={fetchProjectDetails}
            onDelete={handleTaskDelete}
         />
      </div>
   );
};

export default ProjectDetails;
