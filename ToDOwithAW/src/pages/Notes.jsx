import React, { useEffect, useState,useMemo } from "react";
import db from "../appwrite/database";
import "@fontsource/tinos";
import "@fontsource/lato";
import "@fontsource/ubuntu";
import { Query } from "appwrite";

import NewtaskForm from "../components/NewtaskForm";
import Tasks from "../components/Tasks";
import ThemeChanger from "../components/ThemeChanger";
import Footer from "../components/Footer";
import FontChanger from "../components/FontChanger";
import TaskHeader from "../components/TaskHeader";
import EditTask from "../components/EditTask";
import FilterView from "../components/FilterView";
import SortTasks from "../components/SortTasks";

const Notes = () => {
  const [notes, setNotes] = useState([]);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [selectedFont, setSelectedFont] = useState("font-titillium");
  const [animateBolt, setAnimateBolt] = useState(false);
  const [rotateTick, setRotateTick] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  // Near your other state declarations
 
const [activeTasks, setActiveTasks] = useState(0);
  
  const [filterOption, setFilterOption] = useState(() => {
    return localStorage.getItem("filterOption") || "All";
  });
  
  

  const calculateTaskAge = (timestamp) => {
    const startDate = new Date(timestamp);
    const today = new Date();
    let dayCount = 0;
    if (isNaN(startDate)) return 0;
    for (
      let date = new Date(startDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dayCount++;
      }
    }
    return dayCount;
  };

  

  const addTask = (newTask) => {
    setNotes((prevNotes) => {
      const updatedNotes = SortTasks([...new Map([...prevNotes, newTask].map(task => [task.$id, task])).values()]);
      setTotalTasks(updatedNotes.length);
      return updatedNotes;
    });
  };
  
  
 


  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes)) return []; // Ensure `notes` is an array
    return filterOption === "Active"
      ? notes.filter((note) => !note.completed)
      : notes; // Show all tasks for "All"
  }, [notes, filterOption]);
  
// Inside your Notes component

const sortedFilteredNotes = useMemo(() => {
    // Add additional safety checks
    if (!filteredNotes || !Array.isArray(filteredNotes)) {
        console.error('Invalid filteredNotes:', filteredNotes);
        return [];
    }
    
    const sortedNotes = SortTasks(filteredNotes);
    return sortedNotes || []; // Ensure always returning an array
}, [filteredNotes]);



const refreshTasks = async (reason = "general") => {
    setLoading(true);
    try {
      const limitPerPage = 1000;
      let response = await db.todocollection.list([
        Query.limit(limitPerPage),
        Query.orderDesc("$createdAt"),
      ]);
  
      let allDocuments = response.documents;
  
      // Fetch all pages of data
      while (response.total > allDocuments.length) {
        response = await db.todocollection.list([
          Query.limit(limitPerPage),
          Query.offset(allDocuments.length),
          Query.orderDesc("$createdAt"),
        ]);
        allDocuments = [...allDocuments, ...response.documents];
      }
  
      // Deduplicate tasks by their $id
      const tasks = Array.isArray(allDocuments) ? Array.from(new Map(allDocuments.map(task => [task.$id, {
        $id: task.$id,
        ...task,
        criticaltask: !!task.criticaltask,
        completed: !!task.completed,
        duedate: task.duedate ? new Date(task.duedate) : null,
        taskAge: calculateTaskAge(task.$createdAt),
        taskname: task.taskname || "No Name",
      }])).values()) : [];
  
      const sorted = SortTasks(tasks) || [];
      setNotes(sorted);
      setTotalTasks(sorted.length);
    } catch (error) {
      console.error("Error in refreshTasks:", error);
      setNotes([]);
      setTotalTasks(0);
    } finally {
      setLoading(false);
    }
  };

  // On initial mount, do an initial fetch with reason "mount"
  useEffect(() => {
    refreshTasks("mount");
  }, []);

  // Whenever theme changes, store it in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (Array.isArray(notes)) {
      setTotalTasks(notes.length);
      setActiveTasks(notes.filter(note => !note.completed).length);
    }
  }, [notes]);
  
  // NEW: Log "notes changed" whenever the 'notes' state updates

  // In Notes.js:
  const handleSaveTask = (updatedDoc) => {
    //////console.log("handleSaveTask => got updated doc:", updatedDoc);
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.$id === updatedDoc.$id ? { ...note, ...updatedDoc } : note
      );
      const sortedNotes = SortTasks(updatedNotes) || [];
      return [...sortedNotes];
    });
    setIsEditing(false);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsEditing(true);
  };

  const triggerHeaderTickAnimation = () => {
    setRotateTick(true);
    setTimeout(() => setRotateTick(false), 500);
  };

  const getContainerClass = () => {
    switch (theme) {
      case "light":
        return "bg-white text-black";
      case "dark":
        return "bg-gray-900 text-white";
      case "green":
        return "bg-cyan-900 text-white";
      default:
        return "bg-white text-black";
    }
  };

  const getTaskClass = () => {
    switch (theme) {
      case "light":
        return "bg-gray-200";
      case "dark":
        return "bg-gray-800";
      case "green":
        return "bg-cyan-800";
      default:
        return "bg-gray-200";
    }
  };

  const getInputClass = () => {
    switch (theme) {
      case "light":
        return "bg-gray-100 text-black border-gray-300";
      case "dark":
        return "bg-gray-700 text-white border-gray-500";
      case "green":
        return "bg-green-50 text-black border-gray-400";
      default:
        return "bg-gray-100 text-black border-gray-300";
    }
  };

  const textColorByTheme = {
    light: "text-gray-900",
    dark: "text-gray-100",
    green: "text-teal-300",
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }
  
  
  
  return (
    <div
      className={`flex flex-col min-h-screen ${getContainerClass()} ${selectedFont}`}
    >
      <div className="fixed top-0 left-0 right-0 bg-opacity-90 z-10 bg-inherit shadow-md">
        <div className="container mx-auto items-center justify-between mb-1 ">
          <div className="flex items-center space-x-6">
            <ThemeChanger currentTheme={theme} setTheme={setTheme} />
            <FontChanger
              theme={theme}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
            />
            <h1 className="text-3xl flex-1 text-center">
              TaskForce{" "}
              <span
                className={`inline-block ${
                  animateBolt ? "animate-bolt-scale" : ""
                }`}
              >
                ⚡
              </span>
            </h1>
            <span className="flex items-center space-x-6">
            <FilterView
              theme={theme}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              filterOption={filterOption}
              setFilterOption={(option) => {
                localStorage.setItem("filterOption", option);
                setFilterOption(option);
              }}
              />
            </span>
          
            <span className={`ml-4 text-lg ${textColorByTheme[theme] || "text-gray-500"}`}>
  Tasks: {filterOption === "All" ? totalTasks : activeTasks}
</span>
            <span
              role="img"
              aria-label="task"
              className={`ml-2 text-5xl ${rotateTick ? "animate-rotate" : ""}`}
            >
              ☑
            </span>
          </div>

          <NewtaskForm
            addTask={addTask}
            inputClass={getInputClass()}
            theme={theme}
            selectedFont={selectedFont}
            refreshTasks={refreshTasks} // Pass refreshTasks as a prop
          />
          <TaskHeader theme={theme} />
        </div>
      </div>

       

      <div className="container mx-auto pb-8 overflow-y-auto mt-[189px]">
  {Array.isArray(sortedFilteredNotes) &&
    sortedFilteredNotes.map((note) => (
      <div
        key={`container-${note.$id}`}
        className={`p-1 mb-2 rounded-xl shadow flex justify-between items-center text-xm pl-3 ${getTaskClass()}`}
      >
        <Tasks
          key={note.$id}
          taskData={note}
          setNotes={setNotes}
          theme={theme}
          selectedFont={selectedFont}
          triggerHeaderTickAnimation={triggerHeaderTickAnimation}
          onSaveTask={handleSaveTask}
          onEdit={handleEdit}
          setTotalTasks={setTotalTasks}
        />
      </div>
    ))}

  {isEditing && taskToEdit && (
    <EditTask
      task={taskToEdit}
      onSubmit={handleSaveTask}
      onClose={() => setIsEditing(false)}
      theme={theme}
    />
  )}
</div>

      <Footer theme={theme} />
    </div>
  );
};

export default Notes;
