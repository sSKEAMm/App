
import React, { useState, useMemo, useEffect } from 'react';
import { PantryItem, ShoppingList, ShoppingListCollection } from '../types';
import { PANTRY_CATEGORIES } from '../constants';
import Modal from './Modal';
import { getShoppingItemCategory } from '../utils';

// Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096m7.12 0c-.096.075-.207.143-.327.205M12 9.75L12 3.75M12 3.75c-1.355 0-2.582.193-3.75.535m3.75-.535V9.75m0-6H9.375M12 3.75h2.625M12 9.75h2.625M12 9.75H9.375" />
  </svg>
);
const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c.618 0 1.197-.079 1.757-.225M12 15a4.474 4.474 0 01-3.75-1.544M12 15a4.474 4.474 0 003.75-1.544M12 9a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);
const CogIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 4.5v.01M12 19.5v.01" /></svg>
);


interface ShoppingListDisplayProps {
  allLists: ShoppingListCollection;
  activeList: ShoppingList | null;
  onSetActiveList: (listId: string) => void;
  onCreateNewList: (name: string, icon?: string) => void;
  onUpdateListItems: (listId: string, items: PantryItem[]) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
}

const ShoppingListDisplay: React.FC<ShoppingListDisplayProps> = ({ 
  allLists, 
  activeList, 
  onSetActiveList,
  onCreateNewList,
  onUpdateListItems,
  onDeleteList,
  onRenameList
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  const [isManageListModalOpen, setIsManageListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListName, setEditingListName] = useState('');
  const [listToEditId, setListToEditId] = useState<string | null>(null);

  useEffect(() => {
    // Reset checked items when the active list changes
    setCheckedItems(new Set());
  }, [activeList]);

  const toggleChecked = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeList || !newItemName.trim()) return;
    const autoCategory = getShoppingItemCategory(newItemName.trim());
    const newItem: PantryItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        quantity: newItemQuantity.trim() || '1 item',
        category: autoCategory 
    };
    onUpdateListItems(activeList.id, [...activeList.items, newItem]);
    setNewItemName('');
    setNewItemQuantity('');
    setIsAddItemModalOpen(false);
  };
  
  const handleClearChecked = () => {
    if (!activeList || checkedItems.size === 0) return;
    if (window.confirm(`Are you sure you want to remove ${checkedItems.size} checked item(s) from "${activeList.name}"?`)) {
        onUpdateListItems(activeList.id, activeList.items.filter(item => !checkedItems.has(item.id)));
        setCheckedItems(new Set());
    }
  };
  
  const handleClearAllItemsInActiveList = () => {
    if (!activeList || activeList.items.length === 0) return;
    if (window.confirm(`Are you sure you want to clear all items from "${activeList.name}"?`)) {
        onUpdateListItems(activeList.id, []);
        setCheckedItems(new Set());
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateNewList(newListName.trim());
      setNewListName('');
      setIsManageListModalOpen(false);
    }
  };

  const handleStartRenameList = (list: ShoppingList) => {
    setListToEditId(list.id);
    setEditingListName(list.name);
    // Could open a specific rename modal or inline edit
    // For simplicity, using ManageListModal - need to adjust modal for this
    alert(`Rename functionality: Selected "${list.name}". Implement rename UI in Manage List Modal or separate modal.`);
    setIsManageListModalOpen(true); // For now, re-use, but ideally a different state for "renaming"
  };
  
  const handleConfirmRename = () => {
      if (listToEditId && editingListName.trim()) {
          onRenameList(listToEditId, editingListName.trim());
          setListToEditId(null);
          setEditingListName('');
          setIsManageListModalOpen(false);
      }
  }


  const currentListItems = activeList ? activeList.items : [];
  const categorizedItems = useMemo(() => {
    const categoryOrder = PANTRY_CATEGORIES;
    const grouped = currentListItems.reduce((acc, item) => {
      const category = item.category && categoryOrder.includes(item.category) ? item.category : "Other";
      (acc[category] = acc[category] || []).push(item);
      return acc;
    }, {} as Record<string, PantryItem[]>);

    const sortedGrouped: Record<string, PantryItem[]> = {};
    categoryOrder.forEach(cat => { if (grouped[cat]) sortedGrouped[cat] = grouped[cat]; });
    Object.keys(grouped).forEach(cat => { if (!sortedGrouped[cat]) sortedGrouped[cat] = grouped[cat]; });
    return sortedGrouped;
  }, [currentListItems]);

  const listOptions = Object.values(allLists).sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white space-y-2">
        <div className="flex items-center justify-between">
           <div className="relative flex-grow mr-2">
             <select
                value={activeList?.id || ''}
                onChange={(e) => onSetActiveList(e.target.value)}
                className="w-full text-lg sm:text-xl font-bold text-gray-800 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                disabled={listOptions.length === 0}
              >
                {listOptions.length === 0 && <option value="">No lists available</option>}
                {listOptions.map(list => (
                  <option key={list.id} value={list.id}>{list.icon} {list.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
           </div>
          <button 
            onClick={() => setIsManageListModalOpen(true)}
            className="p-2 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors"
            aria-label="Manage shopping lists"
          >
            <CogIcon className="w-6 h-6" />
          </button>
        </div>
         {activeList && currentListItems.length > 0 && (
            <button 
                onClick={handleClearAllItemsInActiveList} 
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
                Clear All Items in "{activeList.name}"
            </button>
        )}
      </div>

      {/* List Content */}
      {!activeList ? (
         <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <p className="text-gray-600">No shopping list selected.</p>
          <p className="text-sm text-gray-500 mt-1">Create a new list or select one to get started.</p>
           <button onClick={() => setIsManageListModalOpen(true)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Manage Lists</button>
        </div>
      ) : currentListItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600">"{activeList.name}" is empty.</p>
          <p className="text-sm text-gray-500 mt-1">Add items by clicking the '+' button below.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-2 sm:p-4 space-y-3 pb-24">
          {Object.entries(categorizedItems).map(([category, catItems]) => (
            <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2 py-1 my-1">{category}</h3>
                <ul className="space-y-1.5">
                    {catItems.map(item => (
                    <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center flex-grow">
                            <input type="checkbox" id={`item-${item.id}`} checked={checkedItems.has(item.id)} onChange={() => toggleChecked(item.id)} className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 focus:ring-offset-0 mr-3 shrink-0"/>
                            <label htmlFor={`item-${item.id}`} className={`flex-grow cursor-pointer ${checkedItems.has(item.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                <span className="font-medium">{item.name}</span>
                            </label>
                        </div>
                        <span className={`text-sm ml-3 shrink-0 ${checkedItems.has(item.id) ? 'text-gray-400' : 'text-gray-500'}`}>{item.quantity}</span>
                    </li>
                    ))}
                </ul>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 shadow-top-strong z-20">
        <div className="max-w-md mx-auto flex items-center justify-around space-x-2">
           <button onClick={() => alert("Voice input coming soon!")} className="p-3 text-gray-500 hover:text-orange-500 rounded-full hover:bg-orange-50 transition-colors" aria-label="Voice input (coming soon)"><MicrophoneIcon className="w-6 h-6" /></button>
          <button onClick={() => setIsAddItemModalOpen(true)} disabled={!activeList} className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-300" aria-label="Add new item"><PlusIcon className="w-7 h-7" /></button>
          <button onClick={handleClearChecked} disabled={!activeList || checkedItems.size === 0} className="p-3 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors relative" aria-label="Clear checked items">
            <TrashIcon className="w-6 h-6" />
            {checkedItems.size > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">{checkedItems.size}</span>}
          </button>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} title={`Add Item to "${activeList?.name || 'List'}"`}>
        <form onSubmit={handleAddItem} className="space-y-4">
            <div><label htmlFor="modalNewItemName" className="block text-sm font-medium text-gray-700">Item Name</label><input type="text" id="modalNewItemName" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g., Milk, Eggs, Apples" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" required autoFocus/></div>
            <div><label htmlFor="modalNewItemQuantity" className="block text-sm font-medium text-gray-700">Quantity & Unit (Optional)</label><input type="text" id="modalNewItemQuantity" value={newItemQuantity} onChange={(e) => setNewItemQuantity(e.target.value)} placeholder="e.g., 1 ltr, 2, 500g, 1 dozen" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"/></div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150">Add to List</button>
        </form>
      </Modal>

      {/* Manage Lists Modal */}
      <Modal isOpen={isManageListModalOpen} onClose={() => { setIsManageListModalOpen(false); setListToEditId(null); setEditingListName(''); }} title={listToEditId ? "Edit List Name" : "Manage Shopping Lists"}>
        <div className="space-y-4">
          {!listToEditId && (
            <>
              <h3 className="text-md font-semibold text-gray-700">Create New List</h3>
              <div className="flex gap-2">
                <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="New list name (e.g., Office, Party)" className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"/>
                <button onClick={handleCreateList} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Create</button>
              </div>
              <hr className="my-4"/>
              <h3 className="text-md font-semibold text-gray-700">Existing Lists</h3>
            </>
          )}

          {listToEditId && (
            <div>
                 <h3 className="text-md font-semibold text-gray-700">Rename List: "{allLists[listToEditId]?.name}"</h3>
                 <div className="flex gap-2 mt-2">
                    <input type="text" value={editingListName} onChange={(e) => setEditingListName(e.target.value)} className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"/>
                    <button onClick={handleConfirmRename} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Name</button>
                 </div>
                 <hr className="my-4"/>
            </div>
          )}
          
          {listOptions.length === 0 && !listToEditId && <p className="text-sm text-gray-500">No lists yet. Create one above!</p>}
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {listOptions.map(list => (
              <li key={list.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                <span className="font-medium text-gray-700">{list.icon} {list.name} <span className="text-xs text-gray-400">({list.items.length} items)</span></span>
                <div className="space-x-1">
                  <button onClick={() => { setListToEditId(list.id); setEditingListName(list.name); /* No need to re-open modal if already open for manage */ }} className="text-xs text-blue-500 hover:text-blue-700 p-1">Edit</button>
                  {listOptions.length > 1 && ( // Prevent deleting the last list
                    <button onClick={() => onDeleteList(list.id)} className="text-xs text-red-500 hover:text-red-700 p-1">Delete</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingListDisplay;
