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
  

  const isLate = (dueDate) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };
 


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

  const sortTasks = (tasks) => {
    const now = new Date();
    // A "day-only" version of the current date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Helper to compare only the day/month/year
    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    // ---------------- BUCKETS ----------------

    // Past, Not Completed (CRITICAL)
    const order1 = tasks.filter(
      (task) =>
        task.criticaltask &&
        task.duedate &&
        new Date(task.duedate) < today &&
        !task.completed
    );

    // Past, Not Completed (NON-CRITICAL)
    const order2 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        task.duedate &&
        new Date(task.duedate) < today &&
        !task.completed
    );

    // Due Today, Not Completed (CRITICAL)
    const order3 = tasks.filter(
      (task) =>
        task.criticaltask &&
        task.duedate &&
        isSameDay(new Date(task.duedate), today) &&
        !task.completed
    );

    // Due Today, Not Completed (NON-CRITICAL)
    const order4 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        task.duedate &&
        isSameDay(new Date(task.duedate), today) &&
        !task.completed
    );

    // Future or No Due Date, Not Completed (CRITICAL)
    const order5 = tasks.filter(
      (task) =>
        task.criticaltask &&
        (!task.duedate || new Date(task.duedate) > today) &&
        !task.completed
    );

    // Future or No Due Date, Not Completed (NON-CRITICAL)
    const order6 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        (!task.duedate || new Date(task.duedate) > today) &&
        !task.completed
    );

    // Past, Completed (CRITICAL)
    const order7 = tasks.filter(
      (task) =>
        task.criticaltask &&
        task.duedate &&
        new Date(task.duedate) < today &&
        task.completed
    );

    // Past, Completed (NON-CRITICAL)
    const order8 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        task.duedate &&
        new Date(task.duedate) < today &&
        task.completed
    );

    // Due Today, Completed (CRITICAL)
    const order9 = tasks.filter(
      (task) =>
        task.criticaltask &&
        task.duedate &&
        isSameDay(new Date(task.duedate), today) &&
        task.completed
    );

    // Due Today, Completed (NON-CRITICAL)
    const order10 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        task.duedate &&
        isSameDay(new Date(task.duedate), today) &&
        task.completed
    );

    // Future or No Due Date, Completed (CRITICAL)
    const order11 = tasks.filter(
      (task) =>
        task.criticaltask &&
        (!task.duedate || new Date(task.duedate) > today) &&
        task.completed
    );

    // Future or No Due Date, Completed (NON-CRITICAL)
    const order12 = tasks.filter(
      (task) =>
        !task.criticaltask &&
        (!task.duedate || new Date(task.duedate) > today) &&
        task.completed
    );

    // ---------------- SORT FUNCTION ----------------
    const sortFn = (a, b) => {
      const ageA = typeof a.taskAge === "number" ? a.taskAge : -Infinity;
      const ageB = typeof b.taskAge === "number" ? b.taskAge : -Infinity;
      // Descending order by age
      return ageB - ageA;
    };

    // Sort each bucket by taskAge
    order1.sort(sortFn);
    order2.sort(sortFn);
    order3.sort(sortFn);
    order4.sort(sortFn);
    order5.sort(sortFn);
    order6.sort(sortFn);
    order7.sort(sortFn);
    order8.sort(sortFn);
    order9.sort(sortFn);
    order10.sort(sortFn);
    order11.sort(sortFn);
    order12.sort(sortFn);

    // ---------------- LEFTOVER BUCKET ----------------
    // Any tasks that didn't land in any of the above filters
    const leftover = tasks.filter(
      (t) =>
        !order1.includes(t) &&
        !order2.includes(t) &&
        !order3.includes(t) &&
        !order4.includes(t) &&
        !order5.includes(t) &&
        !order6.includes(t) &&
        !order7.includes(t) &&
        !order8.includes(t) &&
        !order9.includes(t) &&
        !order10.includes(t) &&
        !order11.includes(t) &&
        !order12.includes(t)
    );

    if (leftover.length > 0) {
      console.warn("Tasks not fitting any filter bucket:", leftover);
    }

    // Return all buckets + leftover
    return [
      ...order1,
      ...order2,
      ...order3,
      ...order4,
      ...order5,
      ...order6,
      ...order7,
      ...order8,
      ...order9,
      ...order10,
      ...order11,
      ...order12,
      ...leftover, // So “missing” tasks still show
    ];
  };

  const addTask = (newTask) => {
    setNotes((prevNotes) => {
      const updatedNotes = sortTasks([...prevNotes, newTask]); // Add new task and sort
      setTotalTasks(updatedNotes.length); // Update totalTasks with the length of the updated list
      return updatedNotes; // Return the updated sorted notes
    });
  };
  

  const sortedNotes = useMemo(() => sortTasks(notes), [notes]);

  const refreshTasks = async (reason = "general") => {
    setLoading(true);
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
        allDocuments = [...allDocuments, ...response.documents];
      }

      const tasks = allDocuments.map((task) => ({
        $id: task.$id,
        ...task,
        criticaltask: !!task.criticaltask,
        completed: !!task.completed,
        duedate: task.duedate ? new Date(task.duedate) : null,
        taskAge: calculateTaskAge(task.$createdAt),
        taskname: task.taskname || "No Name",
      }));

      const sorted = sortTasks(tasks);

      setNotes(sorted); // Ensure a new array is created
      setTotalTasks(sorted.length);
    } catch (error) {
      console.error("Error in refreshTasks:", error);
      setNotes([]); // Reset notes on error
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


  // NEW: Log "notes changed" whenever the 'notes' state updates

  // In Notes.js:
  const handleSaveTask = (updatedDoc) => {
    console.log("handleSaveTask => got updated doc:", updatedDoc);
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) =>
        note.$id === updatedDoc.$id ? { ...note, ...updatedDoc } : note
      );
      const sortedNotes = sortTasks(updatedNotes);
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
            <span
              className={`ml-4 text-lg ${
                textColorByTheme[theme] || "text-gray-500"
              }`}
            >
              Listed Tasks : {totalTasks}
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
        {Array.isArray(notes) && notes.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          Array.isArray(notes) &&
          sortedNotes.map(
            (note) =>
              note &&
              note.$createdAt && (
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
                    onSaveTask={handleSaveTask}
                    onEdit={handleEdit}
                    setTotalTasks={setTotalTasks} 
                  />
                </div>
              )
          )
        )}

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
