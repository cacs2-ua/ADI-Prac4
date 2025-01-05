// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore"; // Firestore SDK imports

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPk3N8ykNyDXUmWyaptvrsSChf2VWItwE",
    authDomain: "adi-practica1.firebaseapp.com",
    projectId: "adi-practica1",
    storageBucket: "adi-practica1.appspot.com",
    messagingSenderId: "269090935688",
    appId: "1:269090935688:web:5e8433ff04a0767f62603d",
    measurementId: "G-L3H40N07VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

try {
    // Log in the user with email and password
    const result = await signInWithEmailAndPassword(auth, "cacs2@alu.ua.es", "123456");
    console.log("User signed in: " + result.user.email);
} catch (error) {
    console.log("Error during sign-in: " + error.message);
}

// Initialize Firestore
const db = getFirestore(app);

// Example Firestore operation to add a document to a collection
const addUser = async () => {
    try {
        // Add a new document with a generated ID to the "users" collection
        const docRef = await addDoc(collection(db, "users"), {
            name: "John Doe",
            email: "johndoe@example.com",
            registered: true
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.log("Error adding document: ", error.message);
    }
};

// Example Firestore operation to get a document from a collection
const getUserData = async (docId) => {
    const docRef = doc(db, "users", docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
};

// Call the functions
addUser();  // Add a user
getUserData('BODDH4PAKirSJB7ZHOOq');  // Get a user's data using a valid document ID