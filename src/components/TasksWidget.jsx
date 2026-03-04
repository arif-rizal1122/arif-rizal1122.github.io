import React, { useState, useEffect } from 'react';

const TasksWidget = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupTitle, setNewGroupTitle] = useState('');

  // Initial load and migration
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('personal_tasks_grouped') || 'null');
    
    if (savedData) {
      setGroups(savedData);
    } else {
      // Check for old flat format migration
      const oldTasks = JSON.parse(localStorage.getItem('personal_tasks') || '[]');
      if (oldTasks.length > 0) {
        const initialGroups = [{
          id: Date.now(),
          title: 'General',
          isOpen: true,
          completed: false,
          tasks: oldTasks
        }];
        setGroups(initialGroups);
        saveToStorage(initialGroups);
        localStorage.removeItem('personal_tasks');
      }
    }
  }, []);

  const saveToStorage = (updatedGroups) => {
    localStorage.setItem('personal_tasks_grouped', JSON.stringify(updatedGroups));
  };

  const addGroup = (e) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    const updatedGroups = [...groups, {
      id: Date.now(),
      title: newGroupTitle,
      isOpen: true,
      completed: false,
      tasks: []
    }];
    setGroups(updatedGroups);
    setNewGroupTitle('');
    saveToStorage(updatedGroups);
  };

  const deleteGroup = (id) => {
    if (!confirm('Hapus seluruh kategori dan tugas di dalamnya?')) return;
    const updatedGroups = groups.filter(g => g.id !== id);
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  const toggleGroupVisibility = (id) => {
    const updatedGroups = groups.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g);
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  const toggleGroupCompletion = (id) => {
    const updatedGroups = groups.map(g => {
      if (g.id === id) {
        const newCompleted = !g.completed;
        // Logic: checking/unchecking main task applies to ALL sub-tasks
        return {
          ...g,
          completed: newCompleted,
          tasks: g.tasks.map(t => ({ ...t, completed: newCompleted }))
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  const addTask = (groupId, text) => {
    if (!text.trim()) return;
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        const newTask = { id: Date.now(), text, completed: false };
        return {
          ...g,
          tasks: [...g.tasks, newTask],
          // If group was completed, adding a new task makes it incomplete
          completed: false
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  const toggleTask = (groupId, taskId) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        const updatedTasks = g.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        // Automatic sync: if all tasks are complete, mark group as complete
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
        return {
          ...g,
          tasks: updatedTasks,
          completed: allCompleted
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  const deleteTask = (groupId, taskId) => {
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.filter(t => t.id !== taskId)
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    saveToStorage(updatedGroups);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <i className="fas fa-layer-group text-indigo-500 mr-2"></i> Task Management
        </h3>
      </div>
      
      {/* Add New Group Input */}
      <form onSubmit={addGroup} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newGroupTitle}
          onChange={(e) => setNewGroupTitle(e.target.value)}
          placeholder="Buat induk tugas (misal: Kerja, Projek A)..."
          className="flex-grow p-2.5 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-gray-100 text-sm"
        />
        <button type="submit" aria-label="Tambah kategori" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
          <i className="fas fa-folder-plus"></i>
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-clipboard-list text-gray-300 dark:text-gray-700 text-5xl mb-4 block"></i>
            <p className="text-gray-400">Belum ada induk tugas.</p>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${group.completed ? 'border-green-500/30 bg-green-50/10 dark:bg-green-900/5' : 'border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10'}`}>
              {/* Group Header (Main Task) */}
              <div className={`p-4 flex items-center justify-between transition-colors ${group.completed ? 'bg-green-50/20 dark:bg-green-900/10' : 'bg-white dark:bg-gray-800'}`}>
                <div className="flex items-center gap-3 flex-grow">
                  {/* Main Task Checkbox */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleGroupCompletion(group.id); }}
                    aria-label={group.completed ? "Batalkan selesai induk" : "Selesaikan seluruh induk"}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      group.completed 
                        ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/40 text-white' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {group.completed && <i className="fas fa-check text-xs"></i>}
                  </button>
                  
                  <button 
                    onClick={() => toggleGroupVisibility(group.id)}
                    className="flex items-center gap-3 flex-grow text-left group/title"
                  >
                    <span className={`font-bold text-sm transition-all ${
                      group.completed 
                        ? 'text-gray-400 line-through' 
                        : 'text-gray-800 dark:text-gray-100 group-hover/title:text-indigo-500'
                    }`}>
                      {group.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      group.completed 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {group.tasks.filter(t => t.completed).length}/{group.tasks.length}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleGroupVisibility(group.id)}
                    className={`text-gray-400 hover:text-indigo-500 p-1.5 transition-transform duration-300 ${group.isOpen ? 'rotate-180' : ''}`}
                    aria-label="Toggle detail"
                  >
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <button 
                     onClick={() => deleteGroup(group.id)}
                     aria-label="Hapus kategori"
                     className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Sub-Tasks Container */}
              {group.isOpen && (
                <div className="p-4 pt-2 space-y-3 animate-slideDown">
                  <div className="space-y-2">
                    {group.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl group/item shadow-sm border border-gray-50 dark:border-gray-700/50 hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleTask(group.id, task.id)} 
                            aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                            className={`w-5 h-5 rounded-lg border transition-all ${
                              task.completed 
                                ? 'bg-green-500 border-green-500 shadow-md shadow-green-500/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                            } flex items-center justify-center`}
                          >
                            {task.completed && <i className="fas fa-check text-[10px] text-white"></i>}
                          </button>
                          <span className={`text-sm tracking-tight ${task.completed ? 'line-through text-gray-400 italic' : 'text-gray-700 dark:text-gray-200 font-medium'}`}>
                            {task.text}
                          </span>
                        </div>
                        <button 
                          onClick={() => deleteTask(group.id, task.id)} 
                          aria-label="Hapus tugas"
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-1"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Local Add Task Input */}
                  <div className="pt-2">
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-indigo-500">
                        <i className="fas fa-plus text-[10px]"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Tambah sub-tugas..."
                        className="w-full p-2.5 pl-9 pr-4 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-indigo-500 focus:border-solid dark:text-gray-300 transition-all shadow-inner"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addTask(group.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
