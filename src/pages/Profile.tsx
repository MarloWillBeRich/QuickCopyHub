import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, profile } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Use a fallback avatar color based on email length just for visual diversity
  const fallbackColor = "bg-primary";

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingPass(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      toast.success('Mot de passe mis à jour !');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setLoadingPass(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingProfile(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto w-full custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Paramètres du compte</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et la sécurité de votre compte.</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 border-b border-card-border pb-4">Profil Public</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
             <div className={`w-24 h-24 rounded-full ${!avatarUrl ? fallbackColor : 'bg-muted'} flex items-center justify-center overflow-hidden shrink-0 border-4 border-background shadow-lg`}>
               {avatarUrl ? (
                 <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl font-bold text-primary-foreground">{user?.email?.charAt(0).toUpperCase()}</span>
               )}
             </div>
             <div className="space-y-4 flex-1 w-full">
               <form onSubmit={handleUpdateProfile} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Lien de l'Avatar (URL)</label>
                    <Input 
                      placeholder="https://example.com/avatar.png" 
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                 </div>
                 <Button type="submit" disabled={loadingProfile}>{loadingProfile ? 'Enregistrement...' : 'Mettre à jour le profil'}</Button>
               </form>
             </div>
          </div>

          <div className="space-y-4 border-t border-card-border pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse Email</label>
              <Input value={user?.email || ''} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">L'adresse email ne peut pas être modifiée.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Membre depuis</label>
              <Input 
                value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : ''} 
                disabled 
                className="bg-muted text-muted-foreground cursor-not-allowed" 
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 border-b border-card-border pb-4 text-destructive">Sécurité</h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau mot de passe</label>
              <Input 
                type="password"
                placeholder="Nouveau mot de passe" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" variant="destructive" disabled={loadingPass}>
              {loadingPass ? 'Mise à jour...' : 'Changer le mot de passe'}
            </Button>
          </form>
        </div>

      </motion.div>
    </div>
  );
}
