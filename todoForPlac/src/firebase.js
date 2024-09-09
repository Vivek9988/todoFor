import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvRT7XntvafSCVqKnO33kVTGPQCSe2Hpw",
    authDomain: "kanban-ba70e.firebaseapp.com",
    projectId: "kanban-ba70e",
    storageBucket: "kanban-ba70e.appspot.com",
    messagingSenderId: "798409574824",
    appId: "1:798409574824:web:d8464b4261bf05fe60b59d",
    measurementId: "G-DXYBPM49G0"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to fetch todos from Firestore
export const fetchTodos = async () => {
    const tasksCollection = collection(db, "tasks");
    const querySnapshot = await getDocs(tasksCollection);
    const tasks = [];
    querySnapshot.forEach((doc) => {
        tasks.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return tasks;
};

// Function to add a new todo to Firestore
export const addTodoToFirestore = async (todo) => {
    const docRef = await addDoc(collection(db, "tasks"), {
        ...todo,
        completed: false, // default to not completed
        status: "Todo", // default status
    });
    return docRef;
};

// Function to update a todo in Firestore
export const updateTodoInFirestore = async (id, updatedTodo) => {
    const todoDoc = doc(db, "tasks", id);
    await updateDoc(todoDoc, updatedTodo);
};

// Function to delete a todo from Firestore
export const deleteTodoFromFirestore = async (id) => {
    const todoDoc = doc(db, "tasks", id);
    await deleteDoc(todoDoc);
};
