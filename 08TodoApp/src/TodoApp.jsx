import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Load todos from local storage when the component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    console.log('Loaded todos from local storage:', savedTodos); // Debugging log
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    console.log('Saving todos to local storage:', todos); // Debugging log
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const updatedTodos = [...todos, { text: newTodo, completed: false, isEditing: false }];
      setTodos(updatedTodos);
      setNewTodo('');
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isEditing: true } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleSaveTodo = (index, newText) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: newText, isEditing: false } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-center text-white mb-8">Manage Your Todos</h1>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white outline-none"
            placeholder="Write a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="bg-green-600 p-3 rounded-r-lg text-white hover:bg-green-700 transition"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>
        <ul className="space-y-4">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(index)}
                  className="mr-3"
                />
                {todo.isEditing ? (
                  <input
                    type="text"
                    className="p-2 bg-gray-600 text-white rounded"
                    defaultValue={todo.text}
                    onBlur={(e) => handleSaveTodo(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveTodo(index, e.target.value);
                      }
                    }}
                  />
                ) : (
                  <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {todo.isEditing ? (
                  <button className="text-green-500 hover:text-green-400" onClick={() => handleSaveTodo(index, todo.text)}>
                    <i className="fas fa-save"></i>
                  </button>
                ) : (
                  <button className="text-yellow-500 hover:text-yellow-400" onClick={() => handleEditTodo(index)}>
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                )}
                <button
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDeleteTodo(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
