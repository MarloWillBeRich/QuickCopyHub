import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Copy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] flex flex-col text-white overflow-hidden">
      <nav className="border-b border-[#1F1F1F] p-4 flex justify-between items-center z-10 backdrop-blur-md bg-[#0A0A0A]/80 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
            <Copy size={20} />
          </div>
          QuickCopy Hub
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link to="/register">
            <Button>Commencer</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/20 text-gray-300 text-sm mb-6 border border-[#2F2F2F]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            La nouvelle façon de stocker vos snippets
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
            Stocker. Copier. <br/> <span className="text-blue-500">Utiliser.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Stockez, organisez et copiez en un clic vos textes, liens, codes, templates, et prompts IA. Le tout avec une interface ultra-rapide et moderne.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 text-base group bg-blue-600 hover:bg-blue-700 text-white border-0">
                Créer un compte
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-[#2F2F2F] text-white hover:bg-[#1A1A1A]">
                Se connecter
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
