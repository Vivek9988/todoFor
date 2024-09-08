import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos: [
        {
            title: "Todo msg",
            description: "none",
            date: "none",
            status: "none",
            priority: "none",
            completed: false,
        },
    ],
    addTodo: (todo) => { },
    updateTodo: (todo, id) => { },
    deleteTodo: (id) => { },
    toggleComplete: (id) => { },
});
 
export const TodoProvider = TodoContext.Provider;

export const useTodo = () => {
    return useContext(TodoContext);
};
