import React, { useState, useEffect } from 'react';

const TasksWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('personal_tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const updatedTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
    setTasks(updatedTasks);
    setNewTask('');
    localStorage.setItem('personal_tasks', JSON.stringify(updatedTasks));
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    localStorage.setItem('personal_tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('personal_tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <i className="fas fa-check-circle text-green-500 mr-2"></i> Task List
      </h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Tambah tugas baru..."
          className="flex-grow p-2 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-gray-100"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 px-4 rounded-lg transition-colors">
          <i className="fas fa-plus"></i>
        </button>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Belum ada tugas.</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded border ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center transition-colors`}>
                  {task.completed && <i className="fas fa-check text-[10px] text-white"></i>}
                </button>
                <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                  {task.text}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
