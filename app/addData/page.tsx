"use client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";

// Define the interface for user data
interface Type {
  id: string;
  name: string; // Ensure this matches the Firestore field
}

export default function AddData() {
  const [inputValue, setInputValue] = useState<string>(""); // State for input value
  const [users, setUsers] = useState<Type[]>([]); // State for user list
  const [editingUser, setEditingUser] = useState<Type | null>(null);
  const [updatedName, setUpdatedName] = useState("");

  // Handle form submission for adding data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") return; // Prevent empty submissions

    try {
      await addDoc(collection(db, "Users"), {
        name: inputValue,
      });
      setInputValue(""); // Clear input field
      fetchUsers(); // Refresh user list
      console.log("User saved");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const userList: Type[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name as string, // Ensure correct field
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Handle deletion of a user
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Users", id));
      setUsers(users.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Set user for editing
  const handleEdit = (user: Type) => {
    setEditingUser(user);
    setUpdatedName(user.name);
  };

  // Handle updating user information
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (editingUser && updatedName.trim() !== "") {
      try {
        const userDoc = doc(db, "Users", editingUser.id);
        await updateDoc(userDoc, { name: updatedName });
        setUpdatedName(""); // Clear updated name
        setEditingUser(null); // Clear editing state
        fetchUsers(); // Refresh user list
        console.log("User updated");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      console.warn("Updated name is empty or no user is being edited");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {editingUser ? "Update Data" : "Add Data"}
        </h2>
        
        {/* Form for Adding Data */}
        {!editingUser && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-700"
              >
                Data
              </label>
              <input
                type="text"
                id="data"
                name="data"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your data"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Data
            </button>
          </form>
        )}
        
        {/* Form for Updating Data */}
        {editingUser && (
          <form onSubmit={handleUpdate} className="space-y-6 mt-8">
            <div>
              <label
                htmlFor="updatedName"
                className="block text-sm font-medium text-gray-700"
              >
                Update Data
              </label>
              <input
                type="text"
                id="updatedName"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                placeholder="Enter new data"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </form>
        )}
        
        {/* User List */}
        <div className="bg-white shadow-2xl rounded-xl p-2 mt-10">
          <h1 className="text-center font-bold text-2xl">User List</h1>
          {users.length > 0 ? (
            users.map((user) => (
              <div className="flex justify-between items-center py-2" key={user.id}>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-purple-700 text-white p-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-700 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
}
