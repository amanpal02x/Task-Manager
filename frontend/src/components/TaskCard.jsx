import React from 'react';
import { Calendar, Paperclip, MessageSquare, ListTodo, Flag, MoreVertical, Clock } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const isCompleted = task.status === 'completed';
  
  // Dynamic colors for priority
  const priorityStyles = {
    high: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-600' },
    medium: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-600' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-600' }
  };

  const style = priorityStyles[task.priority] || priorityStyles.low;

  return (
    <div 
      onClick={() => onClick?.(task)}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
    >
      <div className="space-y-4">
        {/* Priority & Meta */}
        <div className="flex items-center justify-between">
          <div className={`px-2.5 py-0.5 ${style.bg} ${style.text} rounded-full flex items-center gap-1.5`}>
            <div className={`w-1 h-1 rounded-full ${style.dot}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{task.priority}</span>
          </div>
          <button className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Title & Info */}
        <div>
          <h4 className="text-[14px] font-bold text-[#0F172A] mb-1 group-hover:text-[#10B981] transition-colors truncate">
            {task.title}
          </h4>
          <p className="text-[12px] text-[#64748B] line-clamp-2 leading-relaxed">
            {task.description || 'No description provided'}
          </p>
        </div>

        {/* Date & Tags */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#F1F5F9]">
            <Clock size={12} />
            <span className="text-[11px] font-bold">
              {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Deadline'}
            </span>
          </div>
          {isCompleted && (
            <div className="text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-lg text-[11px] font-bold">
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[10px] font-bold text-[#64748B]">
            {typeof task.assignedTo === 'object' ? task.assignedTo?.name?.charAt(0) : 'U'}
          </div>
          <span className="text-[11px] font-semibold text-[#94A3B8]">
            {typeof task.assignedTo === 'object' ? task.assignedTo?.name : 'Unassigned'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[#94A3B8]">
          <div className="flex items-center gap-1">
            <MessageSquare size={12} />
            <span className="text-[10px] font-bold">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
