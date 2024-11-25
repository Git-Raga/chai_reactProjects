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
 import TaskHeader from '../components/TaskHeader'
 

function Notes() {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); 
  const [selectedFont, setSelectedFont] = useState('font-titillium');
  const [animateBolt, setAnimateBolt] = useState(false);
  const [rotateTick, setRotateTick] = useState(false);

  const init = async () => {
    try {
      const limitPerPage = 100;
      let response = await db.todocollection.list([
        Query.limit(limitPerPage),
        Query.orderDesc("$createdAt"),
      ]);

      let allDocuments = response.documents;

      while (response.total > allDocuments.length) {
        response = await db.todocollection.list([
          Query.limit(limitPerPage),
          Query.offset(allDocuments.length),
          Query.orderDesc("$createdAt"),
        ]);
        allDocuments = allDocuments.concat(response.documents);
      }

      const tasks = allDocuments
        .filter(task => task && task.$createdAt)
        .map((task) => {
          const taskAge = calculateTaskAge(task.$createdAt);
          return { ...task, taskAge };
        });

      const sortedTasks = sortTasks(tasks);
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

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.criticaltask && !b.criticaltask) return -1;
      if (!a.criticaltask && b.criticaltask) return 1;
      return b.taskAge - a.taskAge || new Date(a.$createdAt) - new Date(b.$createdAt);
    });
  };

  const triggerHeaderTickAnimation = () => {
    setRotateTick(true);
    setTimeout(() => setRotateTick(false), 500);
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
      <div className="fixed top-0 left-0 right-0 bg-opacity-90 z-10 bg-inherit shadow-md">
        <div className="container mx-auto items-center justify-between mb-1">
          <div className="flex items-center space-x-6">
            <ThemeChanger currentTheme={theme} setTheme={setTheme} />
            <FontChanger theme={theme} selectedFont={selectedFont} setSelectedFont={setSelectedFont} /> 
            <h1 className="text-3xl flex-1 text-center">
              TaskForce{" "}
              <span className={`inline-block ${animateBolt ? 'animate-bolt-scale' : ''}`}>⚡</span>
            </h1>
            <span
              role="img"
              aria-label="task"
              className={`ml-2 text-5xl ${rotateTick ? 'animate-rotate' : ''}`}
            >
              ☑
            </span>
          </div>

          <NewtaskForm 
            setNotes={(updatedNotes) => {
              setNotes(updatedNotes);
              setAnimateBolt(true);
              setTimeout(() => setAnimateBolt(false), 300);
            }}
            inputClass={getInputClass()}
            theme={theme}
            selectedFont={selectedFont}
          />
          { <TaskHeader
                 theme={theme}
                 /> }
        </div>
      </div>
      
      <div className="flex-grow container mx-auto pt-46 pb-8 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          notes.map((note) => (
            note && note.$createdAt && (
              <div
                key={note.$id}
                className={`p-1 mb-2 rounded-xl shadow flex justify-between items-center text-xm pl-3 ${getTaskClass()}`}
              >
               
                <Tasks 
                  taskData={note}  
                  setNotes={setNotes} 
                  theme={theme}
                  selectedFont={selectedFont}
                  triggerHeaderTickAnimation={triggerHeaderTickAnimation}
                />
              </div>
            )
          ))
        )}
      </div>

      <Footer theme={theme}/>
    </div>
  );
}

export default Notes;
