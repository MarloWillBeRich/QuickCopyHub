import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Type, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Code, 
  Bot, 
  Mail, 
  Star, 
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'texts', label: 'Textes', icon: Type, path: '/dashboard?filter=texts' },
  { id: 'images', label: 'Images', icon: ImageIcon, path: '/dashboard?filter=images' },
  { id: 'links', label: 'Liens', icon: LinkIcon, path: '/dashboard?filter=links' },
  { id: 'codes', label: 'Codes', icon: Code, path: '/dashboard?filter=codes' },
  { id: 'prompts', label: 'Prompts IA', icon: Bot, path: '/dashboard?filter=prompts' },
  { id: 'emails', label: 'Emails', icon: Mail, path: '/dashboard?filter=emails' },
  { id: 'notes', label: 'Notes', icon: FileText, path: '/dashboard?filter=notes' },
];

const SYSTEM = [
  { id: 'favorites', label: 'Favoris', icon: Star, path: '/dashboard?filter=favorites' },
];

export default function AppLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname + location.search === path;
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-2 font-bold text-xl tracking-tight pr-12 md:pr-4">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
          <Type size={20} />
        </div>
        <span className="text-white">QuickCopy Hub</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 mb-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2 ml-2">Library</p>
          <ul className="space-y-1">
            {CATEGORIES.map((item) => (
              <li key={item.id}>
                <Link to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <span className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors",
                    isActive(item.path) 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <item.icon size={18} />
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 mt-8">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2 ml-2">Organization</p>
          <ul className="space-y-1">
            {SYSTEM.map((item) => (
              <li key={item.id}>
                <Link to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <span className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors",
                    isActive(item.path) 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <item.icon size={18} />
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-card-border">
        <div className="flex flex-col space-y-1">
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
             <span className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors w-full",
                location.pathname === '/profile'
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Settings size={18} />
                Paramètres
              </span>
          </Link>
          <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-left w-full">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
        <div className="mt-4 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
             {user?.photoURL ? <img src={user.photoURL} alt="avatar" /> : <div className="text-muted-foreground text-xs">{user?.email?.charAt(0).toUpperCase()}</div>}
          </div>
          <div className="text-xs truncate overflow-hidden text-muted-foreground">
            {user?.email}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0F0F0F] border-r border-[#1F1F1F] shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Top Nav & Menu */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="flex items-center justify-between p-4">
          <div className="font-bold">QuickCopy</div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card border-r border-card-border z-50 md:hidden flex flex-col"
            >
              <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-50" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-[60px] md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
