import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopiedItem, ItemType } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X } from 'lucide-react';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CopiedItem | null;
  onSave: (data: { title: string; content: string; type: ItemType }) => Promise<void>;
}

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'text', label: 'Texte' },
  { value: 'link', label: 'Lien' },
  { value: 'image', label: 'Image (URL)' },
  { value: 'code', label: 'Code' },
  { value: 'prompt', label: 'Prompt IA' },
  { value: 'email', label: 'Email' },
  { value: 'note', label: 'Note' },
];

export default function CreateEditModal({ isOpen, onClose, item, onSave }: CreateEditModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ItemType>('text');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      setTitle(item.title);
      setContent(item.content);
      setType(item.type);
    } else if (isOpen) {
      setTitle('');
      setContent('');
      setType('text');
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ title, content, type });
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg overflow-hidden rounded-xl bg-card border border-card-border shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-semibold">
                  {item ? 'Modifier l\'élément' : 'Nouvel élément'}
                </Dialog.Title>
                <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {ITEM_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setType(t.value)}
                        className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                          type === t.value
                            ? 'bg-primary text-primary-foreground border-primary font-medium'
                            : 'bg-background text-muted-foreground border-card-border hover:border-muted-foreground/50'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    placeholder="Nom pour le retrouver facilement..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contenu</label>
                  <textarea
                    placeholder="Collez votre contenu ici..."
                    className="flex min-h-[150px] w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
