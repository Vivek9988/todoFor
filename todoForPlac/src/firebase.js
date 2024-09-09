import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
