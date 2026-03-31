import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Circle, CheckCircle2, Loader2, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const todosRef = collection(db, 'users', user.uid, 'todos');
    
    const unsubscribe = onSnapshot(todosRef, (snapshot) => {
      const loadedTodos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedTodos.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
      setTodos(loadedTodos);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newTodoId = Date.now().toString();
    const todoData = {
      id: newTodoId, 
      text: newTask.trim(),
      isCompleted: false,
      createdAt: serverTimestamp()
    };
    
    setNewTask(''); 

    try {
      await setDoc(doc(db, 'users', user.uid, 'todos', newTodoId), todoData);
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await updateDoc(doc(db, 'users', user.uid, 'todos', todo.id), {
        isCompleted: !todo.isCompleted
      });
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'todos', todoId));
      toast.success('Task removed', { icon: '🗑️', style: { background: '#334155', color: '#fff' }});
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="mt-5 flex flex-col h-full w-full">
      <form onSubmit={handleAddTask} className="flex gap-2 sm:gap-3 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!newTask.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white p-3 sm:p-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-2.5 sm:space-y-2">
        {isLoading ? (
          <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
        ) : todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <ListTodo className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-20" />
            <p className="text-xs sm:text-sm font-medium">You have no tasks.<br/>Add a new one above!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id}
              className={`group flex items-center justify-between p-3 sm:p-3 rounded-xl border transition-all duration-300 ${
                todo.isCompleted 
                  ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 cursor-pointer py-1" onClick={() => toggleTodo(todo)}>
                <button className={`shrink-0 transition-colors ${todo.isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'}`}>
                  {todo.isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-5 sm:h-5" /> : <Circle className="w-5 h-5 sm:w-5 sm:h-5" />}
                </button>
                <span className={`text-sm sm:text-sm font-medium transition-all select-none ${todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTodo(todo.id)} 
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-slate-400 hover:text-red-400 p-2 sm:p-1.5 rounded-lg transition-all shrink-0 ml-2 active:scale-90 bg-slate-700/50 md:bg-transparent"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}