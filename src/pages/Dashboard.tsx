import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Layers, Loader2 } from 'lucide-react';
import { itemsApi, CopiedItem, ItemType } from '../lib/api';
import ItemCard from '../components/cards/ItemCard';
import CreateEditModal from '../components/modals/CreateEditModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<CopiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CopiedItem | null>(null);
  
  const [itemToDelete, setItemToDelete] = useState<CopiedItem | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filterType = searchParams.get('filter');

  const getTitle = () => {
    if (filterType === 'favorites') return 'Mes Favoris';
    if (filterType === 'texts') return 'Textes';
    if (filterType === 'images') return 'Images';
    if (filterType === 'links') return 'Liens';
    if (filterType === 'codes') return 'Codes';
    if (filterType === 'prompts') return 'Prompts IA';
    if (filterType === 'emails') return 'Emails';
    if (filterType === 'notes') return 'Notes';
    return 'Tous les éléments';
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemsApi.getItems();
      setItems(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des éléments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => !item.isTrashed); // always exclude currently trashed items securely to prevent ghosting
    
    // Type/Category Filter
    if (filterType) {
      if (filterType === 'favorites') {
        result = result.filter(item => item.isFavorite);
      } else {
        // Map filter names to object types (e.g. 'texts' -> 'text')
        const mappedType = filterType.replace(/s$/, '') as ItemType; 
        result = result.filter(item => item.type === mappedType);
      }
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, filterType, searchQuery]);

  const handleSaveItem = async (data: { title: string; content: string; type: ItemType }) => {
    try {
      if (editingItem) {
        await itemsApi.updateItem(editingItem.id, data);
        setItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
        toast.success('Élément mis à jour !');
      } else {
        const newItem = await itemsApi.createItem(data);
        setItems(prev => [newItem, ...prev]);
        toast.success('Élément ajouté à la bibliothèque !');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleCopy = async (item: CopiedItem) => {
    try {
      await itemsApi.incrementCopy(item.id, item.copyCount);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, copyCount: i.copyCount + 1 } : i));
    } catch (err) {
      // Silently fail for copy increment error, no big deal
    }
  };

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      await itemsApi.updateItem(id, { isFavorite: isFav });
      setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: isFav } : i));
      if (isFav) toast.success('Ajouté aux favoris');
    } catch (err) {
      toast.error('Impossible de modifier les favoris');
    }
  };

  const handleDeleteRequest = (item: CopiedItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await itemsApi.deleteItem(itemToDelete.id);
      setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
      toast.success('Élément supprimé');
    } catch (err) {
      toast.error('Une erreur est survenue lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CopiedItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-md shrink-0 gap-4 z-10">
        <div className="font-semibold text-lg sm:text-xl flex items-center gap-2">
          {getTitle()}
          <span className="text-gray-600 text-sm font-normal hidden sm:inline-block">
            {filteredItems.length} items
          </span>
        </div>
        
        <div className="flex-1 max-w-md hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-gray-500" />
          <input 
            className="block w-full pl-10 pr-12 py-1.5 bg-[#141414] border border-[#1F1F1F] rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="Rechercher (titre, contenu...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] border border-[#2F2F2F] rounded px-1.5 py-0.5 text-gray-500">⌘ K</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-1.5 bg-white text-black text-sm font-semibold rounded-md hover:bg-gray-200">
            <Plus size={16} />
            <span className="hidden sm:inline">New Entry</span>
          </Button>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="p-4 border-b border-[#1F1F1F] md:hidden shrink-0 bg-[#0A0A0A]">
         <div className="flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-gray-500" />
          <input 
            className="block w-full pl-10 pr-4 py-2 bg-[#141414] border border-[#1F1F1F] rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="Rechercher..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A] custom-scrollbar">
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItems.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center max-w-sm mx-auto">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
               <Layers size={32} />
             </div>
             <h3 className="text-xl font-semibold mb-2">Aucun élément</h3>
             <p className="text-muted-foreground mb-6">
               {searchQuery 
                 ? "Aucun résultat ne correspond à votre recherche." 
                 : "Commencez à construire votre bibliothèque en ajoutant votre premier contenu."}
             </p>
             {!searchQuery && (
               <Button onClick={openCreateModal} size="lg">Ajouter mon premier élément</Button>
             )}
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onCopy={handleCopy}
                  onEdit={openEditModal}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <CreateEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || ''}
      />
    </div>
  );
}
