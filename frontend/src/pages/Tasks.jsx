import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Filter, 
  Clock
} from 'lucide-react';
import api from '../services/api';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTaskDelete = async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      if (res.data.success) {
        toast.success('Task deleted successfully');
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'all' ? true : t.status === filterStatus;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (t.project?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusTabs = [
    { label: 'All Tasks', value: 'all' },
    { label: 'To Do', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

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
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1 font-heading">Tasks</h1>
          <p className="text-[#64748B] text-[15px] font-medium">Stay focused and track your daily priorities.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#10B981] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} strokeWidth={2.5} /> Create Task
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 animate-reveal-premium">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks or projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#10B981] transition-all shadow-sm"
          />
        </div>
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[13px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-all shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-8 border-b border-[#E2E8F0] animate-reveal-premium">
        {statusTabs.map((tab) => (
          <button 
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`pb-4 text-[14px] font-bold transition-all relative ${
              filterStatus === tab.value 
                ? 'text-[#10B981]' 
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
            {filterStatus === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-premium">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onClick={() => setSelectedTask(task)} 
            />
          ))
        ) : (
          <div className="col-span-full bg-white border border-[#E2E8F0] border-dashed rounded-2xl h-64 flex flex-col items-center justify-center text-[#94A3B8] gap-3">
             <CheckCircle2 size={40} strokeWidth={1.5} />
             <p className="text-sm font-semibold">No tasks found for this filter</p>
          </div>
        )}
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={fetchTasks}
      />

      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchTasks}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default Tasks;
