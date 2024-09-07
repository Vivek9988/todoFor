import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import TodoForm from './Components/TodoForm';
import TodoItem from './Components/TodoList';
import { TodoProvider } from './contexts/TodoContext'

const App = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const[todos, setTodos] = useState([])

  const handleCreateTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleCloseModal = () => {
    setShowTaskForm(false); 
  };
  

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev])

  }


  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id ===
      id ? todo : prevTodo)))

  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id != id))

  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodo) => prevTodo.id ===
      id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))

  }



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
          <div className='w-1/3'>
            <div className='text-center flex items-center justify-center bg-violet-800 text-white p-3 rounded-t-lg'>
              TODO
            </div>
              {todos.map((todo123) => (
                <div key={todo123.id} className='w-full'>
                  <TodoItem todo={todo123} />
                </div>
              ))}
          </div>

          <div className='w-1/3'>
            <div className='text-center flex items-center justify-center bg-yellow-300 text-white p-3 rounded-t-lg'>
              TODO
            </div>
            <div className=''>
              helloaf
            </div>
          </div>

          <div className='w-1/3'>
            <div className='text-center flex items-center justify-center bg-green-600 text-white p-3 rounded-t-lg'>
              TODO
            </div>
            <div className=''>
              helloaf
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
