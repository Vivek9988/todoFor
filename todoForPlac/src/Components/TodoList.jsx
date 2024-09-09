import React, { useState, useEffect } from 'react';
import { useTodo } from '../contexts/TodoContext';
import { deleteTodoFromFirestore, updateTodoInFirestore } from '../firebase';

function TodoList({ todo }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [date, setDate] = useState(todo.date);
    const [status, setStatus] = useState(todo.status);
    const [priority, setPriority] = useState(todo.priority);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const { updateTodo, deleteTodo, toggleComplete } = useTodo();

    const editTodo = async () => {
        const updatedTodo = {
            title,
            description,
            date,
            status,
            priority,
            completed: todo.completed
        };
        try {
            await updateTodoInFirestore(todo.id, updatedTodo);
            updateTodo(todo.id, updatedTodo);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
        setIsTodoEditable(false);
    };

    const toggleCompleted = () => {
        toggleComplete(todo.id);
    };

    const handlePriorityChange = (newPriority) => {
        setPriority(newPriority);
        setShowPriorityDropdown(false);
    };

    const handleDelete = async () => {
        try {
            await deleteTodoFromFirestore(todo.id);
            deleteTodo(todo.id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.priority-dropdown') === null) {
                setShowPriorityDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPriorityStyles = (prio) => {
        switch (prio) {
            case 'High':
                return 'bg-[#FFECE1] text-[#FF5C00]';
            case 'Medium':
                return 'bg-[#FFECE1] text-[#FF00B8]';
            case 'Low':
                return 'bg-[#F0FFDD] text-[#8A8A8A]';
            default:
                return '';
        }
    };

    return (
        <div className={`flex flex-col border border-black/10 rounded-lg px-3 py-2 gap-y-3 shadow-sm duration-300 text-black ${todo.completed ? 'bg-[#c6e9a7]' : 'bg-white'} mt-4`} style={{ maxWidth: '300px', padding: '1rem' }}>
            <div className="flex items-center gap-x-3 mb-3 justify-between">
                {/* Priority Button with Dropdown */}
                <div className="relative flex items-center gap-x-3 priority-dropdown">
                    <button
                        className={`border outline-none px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 ${isTodoEditable ? 'cursor-pointer' : 'cursor-not-allowed'} ${getPriorityStyles(priority)}`}
                        onClick={() => isTodoEditable && setShowPriorityDropdown((prev) => !prev)}
                        disabled={!isTodoEditable}
                    >
                        {priority}
                    </button>

                    {showPriorityDropdown && (
                        <ul className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-28">
                            {["Low", "Medium", "High"].map((prio) => (
                                <li
                                    key={prio}
                                    className={`cursor-pointer px-3 py-1 hover:bg-gray-100 ${prio === priority ? 'font-bold' : ''} ${getPriorityStyles(prio)}`}
                                    onClick={() => handlePriorityChange(prio)}
                                >
                                    {prio}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Checkbox */}
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={todo.completed}
                    onChange={toggleCompleted}
                />
            </div>

            <div className="flex items-center gap-x-3 mb-3">
                <input
                    type="text"
                    className={`border font-semibold text-lg outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? 'border-black/10 px-2' : 'border-transparent'} ${todo.completed ? 'line-through' : ''}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    readOnly={!isTodoEditable}
                />

                <select
                    className={`border outline-none rounded-lg ${isTodoEditable ? 'border-black/10 px-2' : 'border-transparent'}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!isTodoEditable}
                >
                    <option value="Todo">Todo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>

            <textarea
                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? 'border-black/10 px-2' : 'border-transparent'}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={!isTodoEditable}
            />

            <div className="flex items-center gap-x-3 mb-3">
                <label className="font-semibold"></label>
                <input
                    type="date"
                    className={`border outline-none rounded-lg ${isTodoEditable ? 'border-black/10 px-2' : 'border-transparent'}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    readOnly={!isTodoEditable}
                />
            </div>

            <div className="flex justify-between mt-3 gap-x-2">
                <button
                    className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => {
                        if (todo.completed) return;
                        if (isTodoEditable) {
                            editTodo();
                        } else setIsTodoEditable((prev) => !prev);
                    }}
                    disabled={todo.completed}
                >
                    {isTodoEditable ? '📁' : '✏️'}
                </button>

                <button
                    className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100"
                    onClick={handleDelete}
                >
                    ❌
                </button>
            </div>
        </div>
    );
}

export default TodoList;
