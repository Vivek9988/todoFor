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

    const { updateTodo, deleteTodo } = useTodo();

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

    const handleDelete = async () => {
        try {
            await deleteTodoFromFirestore(todo.id);
            deleteTodo(todo.id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const handlePriorityChange = (newPriority) => {
        setPriority(newPriority);
        setShowPriorityDropdown(false);
    };

    const getPriorityStyles = (prio) => {
        switch (prio) {
            case 'High':
                return 'bg-[#FFECE1] text-[#FF5C00]'; // Light Orange background with dark orange text
            case 'Medium':
                return 'bg-[#FFF0FF] text-[#FF00B8]'; // Light Pink background with hot pink text
            case 'Low':
                return 'bg-[#F0FFDD] text-[#8A8A8A]'; // Light Green background with gray text
            default:
                return '';
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

    return (
        <div className={`flex flex-col border border-black/10 rounded-lg px-2 py-1 gap-y-2 shadow-sm duration-300 text-black ${'bg-white'} mt-4`} style={{ maxWidth: '280px' }}>
            {/* Priority Button with Dropdown */}
            <div className="relative flex items-center gap-x-2 priority-dropdown">
                <button
                    className={`border outline-none px-2 py-1 rounded-lg ${isTodoEditable ? 'cursor-pointer' : 'cursor-not-allowed'} ${getPriorityStyles(priority)}`}
                    onClick={() => isTodoEditable && setShowPriorityDropdown((prev) => !prev)}
                    disabled={!isTodoEditable}
                >
                    {priority || 'Priority'}
                </button>

                {showPriorityDropdown && (
                    <ul className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-24 priority-dropdown">
                        {["Low", "Medium", "High"].map((prio) => (
                            <li
                                key={prio}
                                className={`cursor-pointer px-2 py-1 hover:bg-gray-100 ${prio === priority ? `font-bold ${getPriorityStyles(prio)}` : ''}`}
                                onClick={() => handlePriorityChange(prio)}
                            >
                                {prio}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Title and Status */}
            <div className="flex items-center gap-x-2 mb-2">
                <input
                    type="text"
                    className={`border font-semibold text-base outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? 'border-black/10 px-1' : 'border-transparent'} ${todo.completed ? 'line-through' : ''}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    readOnly={!isTodoEditable}
                />

                <select
                    className={`border outline-none rounded-lg ${isTodoEditable ? 'border-black/10 px-1' : 'border-transparent'}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!isTodoEditable}
                >
                    <option value="Todo">Todo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>

            {/* Description */}
            <textarea
                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? 'border-black/10 px-1' : 'border-transparent'}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={!isTodoEditable}
            />

            {/* Line Above Date Section */}
            <hr className="border-t border-gray-300 mt-" />

            {/* Date */}
            <div className="flex items-center">
                <input
                    type="date"
                    className={`border outline-none rounded-lg ${isTodoEditable ? 'border-black/10 px-1' : 'border-transparent'}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    readOnly={!isTodoEditable}
                />
            </div>

            {/* Edit and Delete Controls */}
            <div className="flex justify-between gap-x-1 mt-2">
                <button
                    className="inline-flex w-7 h-7 rounded-lg text-xs border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => {
                        if (todo.completed) return;
                        if (isTodoEditable) {
                            editTodo();
                        } else setIsTodoEditable((prev) => !prev);
                    }}
                >
                    {isTodoEditable ? '📁' : '✏️'}
                </button>

                <button
                    className="inline-flex w-7 h-7 rounded-lg text-xs border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100"
                    onClick={handleDelete}
                >
                    ❌
                </button>
            </div>
        </div>
    );
}

export default TodoList;
