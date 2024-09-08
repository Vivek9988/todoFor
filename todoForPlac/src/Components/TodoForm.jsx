import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';

const TodoForm = ({ handleCloseModal }) => {
    const { addTodo } = useTodo();

    

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('Todo');
    const [priority, setPriority] = useState('Medium');

    const handleCreateTaskClick = () => {
        if (!title || !description || !date) {
            alert('Please fill all fields');
            return;
        }
        const newTask = { title, description, date, status, priority };
        addTodo(newTask);

        setTitle('');
        setDescription('');
        setDate('');
        setStatus('Todo');
        setPriority('Medium');
        handleCloseModal();
    };

    return (
        <div className="flex flex-col items-center">
            <div className="bg-white w-2/3 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl mb-8">Create New Task</h2>
                <div className="mb-4">
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        className="w-full h-32 p-2 border border-gray-300 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Select Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Status</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Priority</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-violet-800 text-white px-4 py-2 rounded"
                        onClick={handleCreateTaskClick}
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoForm;
