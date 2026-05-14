export type ItemType = 'text' | 'link' | 'image' | 'code' | 'prompt' | 'email' | 'note';

export interface CopiedItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ItemType;
  isFavorite: boolean;
  isTrashed: boolean;
  copyCount: number;
  createdAt: any;
  updatedAt: any;
}

const STORAGE_KEY = 'qc_items';

const getStoredItems = (): CopiedItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setStoredItems = (items: CopiedItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const itemsApi = {
  async getItems() {
    const userStr = localStorage.getItem('qc_user');
    if (!userStr) return [];
    const user = JSON.parse(userStr);
    
    // simulate network
    await new Promise(r => setTimeout(r, 300));
    const items = getStoredItems().filter(i => i.userId === user.uid);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createItem(item: Omit<CopiedItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'copyCount' | 'isFavorite' | 'isTrashed'>) {
    const userStr = localStorage.getItem('qc_user');
    if (!userStr) throw new Error('Not authenticated');
    const user = JSON.parse(userStr);
    
    await new Promise(r => setTimeout(r, 200));
    
    const items = getStoredItems();
    const newItem: CopiedItem = {
      ...item,
      id: crypto.randomUUID(),
      userId: user.uid,
      isFavorite: false,
      isTrashed: false,
      copyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    setStoredItems(items);
    return newItem;
  },

  async updateItem(id: string, updates: Partial<CopiedItem>) {
    await new Promise(r => setTimeout(r, 200));
    const items = getStoredItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      setStoredItems(items);
    }
  },

  async deleteItem(id: string) {
    await new Promise(r => setTimeout(r, 200));
    const items = getStoredItems();
    const newItems = items.filter(i => i.id !== id);
    setStoredItems(newItems);
  },
  
  async incrementCopy(id: string, currentCount: number) {
    return this.updateItem(id, { copyCount: currentCount + 1 });
  }
};
