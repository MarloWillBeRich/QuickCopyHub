import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email);
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-card border border-card-border rounded-xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
              <Copy size={20} />
            </div>
            QuickCopy Hub
          </Link>
        </div>
        
        <h2 className="text-2xl font-semibold mb-2 text-center">Créer un compte</h2>
        <p className="text-muted-foreground text-center mb-6">Commencez à construire votre bibliothèque.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              placeholder="vous@exemple.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
