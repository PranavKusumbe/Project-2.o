import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  TrendingUp, 
  Trophy,
  Users,
  FileText,
  Video,
  Settings,
  UserCircle
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../store/useStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'Learning', path: '/student/learning' },
    { icon: Video, label: 'Videos', path: '/student/videos' },
    { icon: FileText, label: 'Tests', path: '/student/tests' },
  // Chat removed
  { icon: Bot, label: 'Chatbot', path: '/student/chatbot' },
    { icon: TrendingUp, label: 'Performance', path: '/student/performance' },
    { icon: Trophy, label: 'Leaderboard', path: '/student/leaderboard' },
  // Community removed
    { icon: UserCircle, label: 'Profile', path: '/student/profile' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  const teacherMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
    { icon: Users, label: 'Students', path: '/teacher/students' },
  // Teacher Chat removed
    { icon: TrendingUp, label: 'Performance', path: '/teacher/performance' },
  // Teacher Community removed
    { icon: UserCircle, label: 'Profile', path: '/teacher/profile' },
    { icon: Settings, label: 'Settings', path: '/teacher/settings' },
  ];

  const menuItems = user?.role === 'student' ? studentMenuItems : teacherMenuItems;

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
        }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-30 lg:translate-x-0 overflow-y-auto"
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Spacer for main content */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
