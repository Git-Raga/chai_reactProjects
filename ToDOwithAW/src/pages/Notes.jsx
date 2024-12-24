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
import TaskHeader from '../components/TaskHeader';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [selectedFont, setSelectedFont] = useState('font-titillium');
  const [animateBolt, setAnimateBolt] = useState(false);
  const [rotateTick, setRotateTick] = useState(false);

  // Check if task is late based on due date
  const isLate = (dueDate) => {
    if (!dueDate) {
      console.log("No due date provided");
      return false;
    }
    const now = new Date();
    return now > dueDate; // Return true if current date is greater than the due date
  };

  // Function to calculate task age based on creation date
  const calculateTaskAge = (timestamp) => {
    const startDate = new Date(timestamp);
    const today = new Date();
    let dayCount = 0;

    if (isNaN(startDate)) {
      console.error("Invalid timestamp format:", timestamp);
      return 0;
    }

    // Count weekdays only (Monday - Friday)
    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // Skip weekends
        dayCount++;
      }
    }

    return dayCount;
  };
/************************** */
const sortTasks = (tasks) => {
  const now = new Date();

  const order1 = tasks.filter(task => task.criticaltask && task.duedate && new Date(task.duedate) < now && !task.completed);
  const order2 = tasks.filter(task => !task.criticaltask && task.duedate && new Date(task.duedate) < now && !task.completed);
  const order3 = tasks.filter(task => task.criticaltask && (!task.duedate || new Date(task.duedate) >= now) && !task.completed);
  const order4 = tasks.filter(task => !task.criticaltask && (!task.duedate || new Date(task.duedate) >= now) && !task.completed);
  const order5 = tasks.filter(task => task.criticaltask && task.duedate && new Date(task.duedate) < now && task.completed);
  const order6 = tasks.filter(task => !task.criticaltask && task.duedate && new Date(task.duedate) < now && task.completed);
  const order7 = tasks.filter(task => task.criticaltask && (!task.duedate || new Date(task.duedate) >= now) && task.completed);
  const order8 = tasks.filter(task => !task.criticaltask && (!task.duedate || new Date(task.duedate) >= now) && task.completed);

  const sortFn = (a, b) => {
      const ageA = typeof a.taskAge === 'number' ? a.taskAge : -Infinity;
      const ageB = typeof b.taskAge === 'number' ? b.taskAge : -Infinity;
      return ageB - ageA;
  };

  order1.sort(sortFn);
  order2.sort(sortFn);
  order3.sort(sortFn);
  order4.sort(sortFn);
  order5.sort(sortFn);
  order6.sort(sortFn);
  order7.sort(sortFn);
  order8.sort(sortFn);

  return [
      ...order1, ...order2, ...order3, ...order4,
      ...order5, ...order6, ...order7, ...order8
  ];
};
/************************** */


  const init = async () => {
    try {
      const limitPerPage = 1000;
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

      const tasks = Array.isArray(allDocuments) ? allDocuments : [];

      const mappedTasks = tasks.map((task) => {
        const dueDate = task.duedate ? new Date(task.duedate) : null;
        const taskAge = calculateTaskAge(task.$createdAt);  // Calculate task age

        // Ensure criticaltask and latetask are handled correctly as booleans
        const criticalTaskBool = !!task.criticaltask; // Convert to boolean
        const lateTaskBool = isLate(dueDate); // Check if task is late

        return {
            ...task,
            criticaltask: criticalTaskBool,
            latetask: lateTaskBool, // Use the late status derived from the due date
            completed: !!task.completed,
            duedate: dueDate, // Correctly set the duedate (either null or actual date)
            taskAge, // Add taskAge for sorting
            taskname: task.taskname || "No Name",
            $id: task.$id,
        };
      });

      setNotes(sortTasks(mappedTasks));
    } catch (error) {
      console.error("Error fetching documents:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const updateNotesAfterEdit = (updatedNotes) => {
    if (Array.isArray(updatedNotes)) {
      setNotes(sortTasks(updatedNotes));
    } else {
      console.error('Expected an array but received:', updatedNotes);
    }
  };

  const triggerHeaderTickAnimation = () => {
    setRotateTick(true);
    setTimeout(() => setRotateTick(false), 500);
  };

  const getContainerClass = () => {
    switch (theme) {
      case 'light': return 'bg-white text-black';
      case 'dark': return 'bg-gray-900 text-white';
      case 'green': return 'bg-cyan-900 text-white';
      default: return 'bg-white text-black';
    }
  };

  const getTaskClass = () => {
    switch (theme) {
      case 'light': return 'bg-gray-200';
      case 'dark': return 'bg-gray-800';
      case 'green': return 'bg-cyan-800';
      default: return 'bg-gray-200';
    }
  };

  const getInputClass = () => {
    switch (theme) {
      case 'light': return 'bg-gray-100 text-black border-gray-300';
      case 'dark': return 'bg-gray-700 text-white border-gray-500';
      case 'green': return 'bg-green-50 text-black border-gray-400';
      default: return 'bg-gray-100 text-black border-gray-300';
    }
  };

  const textColorByTheme = {
    light: 'text-gray-900',
    dark: 'text-gray-100',
    green: 'text-teal-300',
    // Add more themes and colors here
};



  // Calculate the total number of tasks
  const totalTasks = notes.length;
  return (
    <div className={`flex flex-col min-h-screen ${getContainerClass()} ${selectedFont}`}>
      <div className="fixed top-0 left-0 right-0 bg-opacity-90 z-10 bg-inherit shadow-md">
        <div className="container mx-auto items-center justify-between mb-1 ">
          <div className="flex items-center space-x-6">
            <ThemeChanger currentTheme={theme} setTheme={setTheme} />
            <FontChanger theme={theme} selectedFont={selectedFont} setSelectedFont={setSelectedFont} />
            <h1 className="text-3xl flex-1 text-center">
              TaskForce{" "}
              <span className={`inline-block ${animateBolt ? 'animate-bolt-scale' : ''}`}>⚡</span>
            </h1>
            <span className={`ml-4 text-lg ${textColorByTheme[theme] || 'text-gray-500'}`}>Tasks : {totalTasks}</span>
            <span
              role="img"
              aria-label="task"
              className={`ml-2 text-5xl ${rotateTick ? 'animate-rotate' : ''}`}
            >
              ☑
            </span>
          </div>
  
          <NewtaskForm  
            setNotes={updateNotesAfterEdit}
            inputClass={getInputClass()}
            theme={theme}
            selectedFont={selectedFont}
          />
          <TaskHeader theme={theme} />
        </div>
      </div>
  
      <div className="container mx-auto  pb-8 overflow-y-auto mt-[189px]">
        {Array.isArray(notes) && notes.length === 0 ? (
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
                  setNotes={updateNotesAfterEdit}
                  theme={theme}
                  selectedFont={selectedFont}
                  triggerHeaderTickAnimation={triggerHeaderTickAnimation}
                />
              </div>
            )
          ))
        )}
      </div>
  
      <Footer theme={theme} />
    </div>
  );

};

export default Notes;
