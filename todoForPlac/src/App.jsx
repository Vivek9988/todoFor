import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import TodoForm from './Components/TodoForm';
import TodoList from './Components/TodoList';
import { TodoProvider } from './contexts/TodoContext';
import { fetchTodos, addTodoToFirestore } from './firebase'; // Import Firestore helper functions

const App = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [todos, setTodos] = useState([]);

  // Fetch tasks from Firebase when the component mounts
  useEffect(() => {
    (async () => {
      const tasks = await fetchTodos(); // Use fetchTodos from firebase.js
      console.log("Tasks:", tasks);
      setTodos(tasks);
    })();
  }, []);

  // Add new todo and update Firebase
  const addTodo = async (todo) => {
    try {
      const docRef = await addTodoToFirestore(todo); // Use addTodoToFirestore from firebase.js
      console.log("Document written with ID: ", docRef.id);

      // Update local state
      setTodos((prev) => [{ id: docRef.id, ...todo }, ...prev]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCreateTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleCloseModal = () => {
    setShowTaskForm(false);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)));
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodo) =>
      prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo
    ));
  };

  // Filter todos by status
  const todoTasks = todos.filter((todo) => todo.status === 'Todo');
  const inProgressTasks = todos.filter((todo) => todo.status === 'InProgress');
  const completedTasks = todos.filter((todo) => todo.status === 'Complete');

  return (
    <>
      <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
        <Navbar />
        <div className="w-full min-h-screen flex flex-col items-center bg-slate-100">
          <div className="w-2/3 h-24 border bg-white mt-9 flex items-center justify-between px-4 rounded-xl">
            <div className='font-semibold text-xl'>
              Desktop And Mobile Application
            </div>
            <button
              className="ml-auto bg-violet-800 text-white px-4 py-2 rounded"
              onClick={handleCreateTaskClick}
            >
              Create Task
            </button>
          </div>

          {/* Main Page Content */}
          <div className='w-2/3 mt-4 flex gap-4'>
            <div className={`w-1/3 ${todoTasks.length > 0 ? 'bg-white' : ''} h-full `}>
              <div className='text-center flex items-center justify-center bg-violet-700 text-white p-3 rounded-t-lg'>
                TODO
              </div>
              <div className='justify-center flex  '>
                <div className='gap-4'>
                  {todoTasks.map((todo) => (
                    <TodoList key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            </div>

            <div className={`w-1/3 ${inProgressTasks.length > 0 ? 'bg-white' : ''} h-full `}>
              <div className='text-center flex items-center justify-center bg-yellow-300 text-white p-3 rounded-t-lg'>
                IN PROGRESS
              </div>

              <div className='justify-center flex'>
                <div className='p- gap-4 '>
                  {inProgressTasks.map((todo) => (
                    <TodoList key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            </div>

            <div className={`w-1/3 ${completedTasks.length > 0 ? 'bg-white' : ''} h-full`}>
              <div className='text-center flex items-center justify-center bg-green-500 text-white p-3 rounded-t-lg'>
                COMPLETED
              </div>
              <div className='justify-center flex'>
                <div className='p- gap-4'>
                  {completedTasks.map((todo) => (
                    <TodoList key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Popup */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-2/3 rounded-lg shadow-lg">
              <TodoForm handleCloseModal={handleCloseModal} />
            </div>
          </div>
        )}
      </TodoProvider>
    </>
  );
};

export default App;
