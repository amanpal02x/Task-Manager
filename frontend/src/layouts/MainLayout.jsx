import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Users,
  Bell,
  ChevronRight,
  User
} from 'lucide-react';
import ForcePasswordChangeModal from '../components/ForcePasswordChangeModal';
import api from '../services/api';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await api.get(`/search?q=${searchQuery}`);
          if (res.data.success) {
            setSearchResults(res.data.data);
          }
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type, id) => {
    setSearchQuery('');
    setSearchResults(null);
    if (type === 'project') navigate(`/projects/${id}`);
    if (type === 'task') navigate(`/tasks`);
    if (type === 'member') navigate(`/team`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: FolderKanban, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

  const secondaryNavigation = [
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#0F172A]">
      {/* Sidebar Desktop (Hover-Expand) */}
      <aside 
        className="peer/sidebar group hidden lg:flex flex-col bg-white border-r border-[#E2E8F0] fixed h-screen z-50 transition-all duration-300 ease-in-out w-20 hover:w-72 shadow-xl shadow-black/5"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-4 overflow-hidden h-24">
          <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight font-heading text-[#0F172A] opacity-0 peer-hover/sidebar:opacity-100 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Task Manager
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto scrollbar-hide overflow-x-hidden">
          {/* Main Menu Group */}
          <div>
            <p className="px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Task Manager
            </p>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#F1F5F9] text-[#0F172A]' 
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                    <span className="text-[14px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System Group */}
          <div>
            <p className="px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              System
            </p>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#F1F5F9] text-[#0F172A]' 
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                    <span className="text-[14px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-[#E2E8F0] mb-4">
          <div className="flex items-center gap-4 p-2 rounded-2xl transition-all duration-300 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-emerald-100 flex items-center justify-center text-[#10B981] flex-shrink-0">
              <User size={22} />
            </div>
            <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <p className="text-[14px] font-bold text-[#0F172A] truncate leading-tight">{user?.name}</p>
              <p className="text-[11px] font-medium text-[#94A3B8] truncate">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-[#94A3B8] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center text-white">
              <CheckSquare size={16} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold font-heading">Task Manager</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#64748B]"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-6">
          {navigation.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl text-[#64748B] hover:bg-[#F8FAFC]">
              <item.icon size={20} />
              <span className="text-[14px] font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:ml-20 peer-hover/sidebar:lg:ml-72 transition-all duration-300 ease-in-out min-w-0 h-screen overflow-hidden">



        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-[#64748B] hover:bg-[#F8FAFC] rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden lg:block">
              <h2 className="text-lg font-bold text-[#0F172A] font-heading">
                {navigation.find(item => item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))?.name || 'Settings'}
              </h2>
            </div>

            <div className="max-w-md w-full ml-4 hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#10B981] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search projects, tasks, team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-2.5 pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#10B981] focus:bg-white transition-all"
                />
                
                {/* Search Results Dropdown */}
                {searchResults && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden z-50 animate-reveal-premium">
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {searchResults.projects.map(p => (
                        <button key={p._id} onClick={() => handleResultClick('project', p._id)} className="w-full flex items-center gap-3 p-3 hover:bg-[#F8FAFC] rounded-xl text-left transition-all">
                          <FolderKanban size={16} className="text-[#64748B]" />
                          <span className="text-[13px] font-semibold">{p.title}</span>
                        </button>
                      ))}
                      {/* ... other results ... */}
                      {searchResults.projects.length === 0 && searchResults.tasks.length === 0 && (
                        <p className="p-6 text-center text-[#94A3B8] text-[13px]">No results found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-[#E2E8F0] mx-2 hidden sm:block"></div>
            <Link to="/settings" className="flex items-center gap-3 p-1 hover:bg-[#F8FAFC] rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:bg-[#10B981] group-hover:text-white transition-all">
                <User size={18} />
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-bold text-[#0F172A] leading-tight">{user?.name.split(' ')[0]}</p>
                <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <ForcePasswordChangeModal isOpen={user?.needsPasswordChange} />
    </div>
  );
};

export default MainLayout;
