import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-xl bg-[#0F0F0F] border border-[#1F1F1F] shadow-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Supprimer l'élément
                  </Dialog.Title>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    Êtes-vous sûr de vouloir supprimer définitivement <strong className="text-gray-200">"{itemName}"</strong> ? Cette action est irréversible.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-[#1A1A1A] hover:text-white text-gray-400">
                  Annuler
                </Button>
                <Button 
                  type="button" 
                  onClick={() => { onConfirm(); onClose(); }} 
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
