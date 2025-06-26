
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, CheckSquare, Users, DollarSign, Workflow, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Folder, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
    { icon: Workflow, label: 'Workflow', path: '/workflow' },
  ];

  return (
    <div className="bg-slate-800 text-white w-64 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">PROJECT</h1>
        <p className="text-sm text-slate-400">MANAGEMENT</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white border-r-2 border-blue-500'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5 mr-3" />
              Dark Mode
            </>
          ) : (
            <>
              <Sun className="w-5 h-5 mr-3" />
              Light Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
