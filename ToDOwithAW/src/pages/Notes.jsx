import React, { useEffect, useState } from "react";
import db from "../appwrite/database";
import NewtaskForm from "../components/NewtaskForm";
import { Query } from "appwrite";
import Tasks from "../components/Tasks";
import ThemeChanger from '../components/ThemeChanger';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); 

  const init = async () => {
    try {
      const response = await db.todocollection.list([
        Query.orderDesc("$createdAt"),
      ]);
      setNotes(response.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getContainerClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-black';
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'green':
        return 'bg-cyan-900 text-white';
      default:
        return 'bg-white text-black';
    }
  };

  const getTaskClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-200';
      case 'dark':
        return 'bg-gray-800';
      case 'green':
        return 'bg-cyan-800';
      default:
        return 'bg-gray-200';
    }
  };

  const getInputClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-100 text-black border-gray-300';
      case 'dark':
        return 'bg-gray-700 text-white border-gray-500';
      case 'green':
        return 'bg-cyan-100 text-black border-gray-400';
      default:
        return 'bg-gray-100 text-black border-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${getContainerClass()}`}>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <ThemeChanger currentTheme={theme} setTheme={setTheme} />
          <h1 className="text-2xl font-mono">TaskForce - Todolist</h1>
          <span role="img" aria-label="task" className="ml-2 text-5xl">☑</span>
        </div>

        <NewtaskForm setNotes={setNotes} inputClass={getInputClass()} />

        {/* Separator Line */}
        <hr className="my-4 border-gray-300" />

        {notes.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.$id}
              className={`p-1 mb-2 rounded-xl shadow flex justify-between items-center
                pl-3 ${getTaskClass()}`}
            >
              <Tasks 
              taskData={note}  
              setNotes={setNotes} 
              theme={theme}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
