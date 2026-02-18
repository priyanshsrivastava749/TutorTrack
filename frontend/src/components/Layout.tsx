import React from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';
import TypingEffect from './TypingEffect';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: string } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-200 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Tutor<span className="text-brand-500">Track</span>
              </span>
            </div>
            
            {user && (
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-900/30 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
             <div className="inline-block px-5 py-2 rounded-full bg-neutral-900/50 border border-neutral-800/50">
                <div className="text-xs font-mono font-bold text-neutral-500">
                    <TypingEffect words={["Architectured by Priyansh", "Built for Excellence", "TutorTrack 2024"]} />
                </div>
             </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
