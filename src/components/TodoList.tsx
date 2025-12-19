'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const TodoItem = memo(({ todo, editingId, editText, onToggle, onDelete, onStartEdit, onEditChange, onSaveEdit }: {
  todo: Todo;
  editingId: number | null;
  editText: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (todo: Todo) => void;
  onEditChange: (text: string) => void;
  onSaveEdit: (id: number) => void;
}) => (
  <motion.li
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-xl group"
  >
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
      className="w-5 h-5 rounded-lg border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700 flex-shrink-0"
      aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
    />

    {editingId === todo.id ? (
      <input
        type="text"
        value={editText}
        onChange={(e) => onEditChange(e.target.value)}
        onBlur={() => onSaveEdit(todo.id)}
        onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(todo.id)}
        className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
        autoFocus
        aria-label="Edit task"
      />
    ) : (
      <span
        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}
        onDoubleClick={() => onStartEdit(todo)}
      >
        {todo.text}
      </span>
    )}

    <button
      onClick={() => onDelete(todo.id)}
      aria-label={`Delete task "${todo.text}"`}
      className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 text-red-400 hover:text-red-300 flex-shrink-0"
    >
      삭제
    </button>
  </motion.li>
));

TodoItem.displayName = 'TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem('myhomeTodos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Failed to parse todos', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('myhomeTodos', JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
    };

    setTodos(prev => [...prev, newTodoItem]);
    setNewTodo('');
  }, [newTodo]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const startEditing = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);

  const saveEdit = useCallback((id: number) => {
    if (!editText.trim()) return;

    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
  }, [editText]);

  const clearAll = useCallback(() => {
    if (window.confirm('모든 할 일을 삭제하시겠습니까?')) {
      setTodos([]);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedTodosCount = useMemo(() => todos.filter(todo => todo.completed).length, [todos]);

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-6"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0"
      >
        할 일 목록
      </motion.h2>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={addTodo}
        className="mb-4 flex gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-200 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          추가
        </button>
      </motion.form>

      <div className="flex gap-2 mb-6 flex-shrink-0">
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${filter === f
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
          >
            {f === 'all' && `전체 (${todos.length})`}
            {f === 'active' && `미완료 (${activeTodosCount})`}
            {f === 'completed' && `완료 (${completedTodosCount})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        <motion.ul
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <AnimatePresence mode='popLayout'>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editingId={editingId}
                editText={editText}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onStartEdit={startEditing}
                onEditChange={setEditText}
                onSaveEdit={saveEdit}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {todos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex gap-2 flex-shrink-0"
        >
          <button
            onClick={clearAll}
            className="w-full px-4 py-3 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            전체 삭제
          </button>
          {completedTodosCount > 0 && (
            <button
              onClick={clearCompleted}
              className="w-full px-4 py-3 border border-orange-500/50 text-orange-400 rounded-xl hover:bg-orange-500/10 transition-colors"
            >
              완료된 항목 삭제
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}