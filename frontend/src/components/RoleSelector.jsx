import React from 'react';

const RoleSelector = ({ value, onChange }) => {
  return (
    <div className="relative flex p-1.5 bg-[#f1f5f9] rounded-2xl">
      {/* Sliding Highlight Pill */}
      <div 
        className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ transform: value === 'admin' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      
      <button
        type="button"
        onClick={() => onChange('member')}
        className={`relative z-10 flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-300 ${
          value === 'member'
            ? 'text-[#1a2e2a]'
            : 'text-[#94a3b8] hover:text-[#64748b]'
        }`}
      >
        Team Member
      </button>
      <button
        type="button"
        onClick={() => onChange('admin')}
        className={`relative z-10 flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-300 ${
          value === 'admin'
            ? 'text-[#1a2e2a]'
            : 'text-[#94a3b8] hover:text-[#64748b]'
        }`}
      >
        Project Admin
      </button>
    </div>
  );
};

export default RoleSelector;

