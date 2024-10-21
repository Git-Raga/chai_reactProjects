import React, { useEffect, useState } from "react";
import db from "../appwrite/database";
import '@fontsource/tinos';
import '@fontsource/lato';
import '@fontsource/ubuntu';

import NewtaskForm from "../components/NewtaskForm";
import { Query } from "appwrite";
import Tasks from "../components/Tasks";
import ThemeChanger from '../components/ThemeChanger';
import Footer from "../components/Footer";
import FontChanger from "../components/FontChanger";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); 
  const [selectedFont, setSelectedFont] = useState('font-titillium');

  const init = async () => {
    try {
      const response = await db.todocollection.list([
        Query.orderDesc("$createdAt"),
      ]);
      const tasks = response.documents.map((task) => {
        const taskAge = calculateTaskAge(task.$createdAt);
        return { ...task, taskAge };
      });

      // Sort tasks: critical first, then by task age (descending), and if equal, by creation date (ascending).
      // Completed tasks should always appear at the bottom of the list.
      const sortedTasks = tasks.sort((a, b) => {
        // Completed tasks should be last
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        // Critical tasks come before non-critical tasks
        if (a.criticaltask && !b.criticaltask) return -1;
        if (!a.criticaltask && b.criticaltask) return 1;

        // Sort by task age in descending order
        if (a.taskAge !== b.taskAge) {
          return b.taskAge - a.taskAge;
        }

        // If task age is the same, sort by creation date in ascending order
        return new Date(a.$createdAt) - new Date(b.$createdAt);
      });

      setNotes(sortedTasks);
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

  const calculateTaskAge = (timestamp) => {
    const startDate = new Date(timestamp);
    const today = new Date();
    let dayCount = 0;

    if (isNaN(startDate)) {
      console.error("Invalid timestamp format:", timestamp);
      return 0;
    }

    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dayCount++;
      }
    }

    return dayCount;
  };

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
        return 'bg-green-50 text-black border-gray-400';
      default:
        return 'bg-gray-100 text-black border-gray-300';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${getContainerClass()} ${selectedFont}`}>
      {/* Non-scrollable fixed header section */}
      <div className="fixed top-0 left-0 right-0 bg-opacity-90 z-10 bg-inherit shadow-md">
        <div className="container mx-auto items-center justify-between mb-1">
          <div className="flex items-center space-x-6">
            <ThemeChanger currentTheme={theme} setTheme={setTheme} />
            <FontChanger theme={theme} selectedFont={selectedFont} setSelectedFont={setSelectedFont} /> 
            <h1 className="text-2xl flex-1 text-center">TaskForce ⚡ </h1>
            <span role="img" aria-label="task" className="ml-2 text-5xl">☑</span>
          </div>

          <NewtaskForm setNotes={setNotes} inputClass={getInputClass()} theme={theme} selectedFont={selectedFont} />
        </div>

        {/* Separator Line */}
      </div>

      {/* Scrollable task list with sufficient padding to avoid overlap with header */}
      <div className="flex-grow container mx-auto pt-44 pb-8 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.$id}
              className={`p-1 mb-2 rounded-xl shadow flex justify-between items-center text-xm pl-3 ${getTaskClass()}`}
            >
              <Tasks 
                taskData={note}  
                setNotes={setNotes} 
                theme={theme}
                selectedFont={selectedFont}
              />
            </div>
          ))
        )}
      </div>

      {/* Fixed Footer */}
      <Footer theme={theme}/>
    </div>
  );
}

export default Notes;
