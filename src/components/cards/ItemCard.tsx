import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit2, Star, Trash2, CheckCircle2 } from 'lucide-react';
import { CopiedItem, ItemType } from '../../lib/api';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface ItemCardProps {
  key?: React.Key;
  item: CopiedItem;
  onCopy: (item: CopiedItem) => void;
  onEdit: (item: CopiedItem) => void;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onDelete: (item: CopiedItem) => void;
}

const TYPE_COLORS: Record<ItemType, string> = {
  text: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  link: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  image: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  code: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  prompt: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  email: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  note: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

const TYPE_LABELS: Record<ItemType, string> = {
  text: 'Texte',
  link: 'Lien',
  image: 'Image',
  code: 'Code',
  prompt: 'Prompt IA',
  email: 'Email',
  note: 'Note',
};

export default function ItemCard({ item, onCopy, onEdit, onToggleFavorite, onDelete }: ItemCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    toast.success('Copié dans le presse-papier !', { icon: <CheckCircle2 className="text-emerald-500" /> });
    onCopy(item);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col rounded-xl border border-card-border bg-[#0F0F0F] p-4 text-left transition-all hover:border-blue-500/50 h-[220px]"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center border gap-1.5", TYPE_COLORS[item.type])}>
          {TYPE_LABELS[item.type]}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-400" onClick={() => onToggleFavorite(item.id, !item.isFavorite)}>
            <Star size={16} className={cn(item.isFavorite && "fill-amber-400 text-amber-400")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(item)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item)}>
             <Trash2 size={16} />
          </Button>
        </div>
        
        {/* Mobile persistent favorite icon if favorited */}
        {item.isFavorite && <Star size={16} className="fill-amber-400 text-amber-400 md:hidden absolute top-5 right-5" />}
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 truncate group-hover:text-primary transition-colors">{item.title}</h3>
      
      <div className="flex-1 mb-4 overflow-hidden relative">
        <div className="text-xs text-gray-400 line-clamp-4 font-mono p-2 bg-[#050505] rounded border border-card-border h-full">
          {item.type === 'image' && item.content.startsWith('http') ? (
            <div className="w-full h-20 bg-cover bg-center rounded" style={{backgroundImage: `url(${item.content})`}} />
          ) : (
             item.content
          )}
        </div>
        {/* Subtle gradient to hide bottom text */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-[10px] text-gray-600 italic">
          Copié {item.copyCount} fois
        </div>
        <Button 
          variant={copied ? "default" : "secondary"} 
          className="gap-1.5 h-7 px-3 text-[11px] font-semibold"
          onClick={handleCopy}
        >
          {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
          {copied ? 'Copié' : 'Copy'}
        </Button>
      </div>
    </motion.div>
  );
}
