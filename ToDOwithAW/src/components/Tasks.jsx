import React, { useState, useEffect } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt, FaStar } from "react-icons/fa";
import EditTask from "../components/EditTask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Tasks({ taskData, setNotes, theme, selectedFont, triggerHeaderTickAnimation }) {
  const getInitials = (ownerName) => {
    switch (ownerName) {
      case "Abhishek": return "AM";
      case "Neha": return "NA";
      case "Mahima": return "MP";
      case "Suresh": return "SK";
      case "Muskan": return "MD";
      case "Swetha": return "SB";
      case "Raghav M": return "RM";
      case "Dileep": return "DB";
      case "Bhaskar": return "BM";
      case "Architha": return "AS";
      default: return "NA"; // Default if no match is found
    }
  };

  const [task, setTask] = useState({
    ...taskData,
    taskowner: taskData.taskowner || "Unassigned",
    taskownerinitials: getInitials(taskData.taskowner || "Unassigned"),
    starred: taskData.Perfectstar || false,
    duedate: taskData.duedate || "NA",
  });

  const [loading, setLoading] = useState(false);
  const [taskAge, setTaskAge] = useState(0);
  const [animateRow, setAnimateRow] = useState(false);
  const [animateStar, setAnimateStar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const calculateTaskAge = (timestamp) => {
      const startDate = new Date(timestamp);
      const today = new Date();
      let dayCount = 0;

      for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          dayCount++;
        }
      }
      return dayCount;
    };

    if (taskData.$createdAt) {
      const age = calculateTaskAge(taskData.$createdAt);
      setTaskAge(age);
    }
  }, [taskData.$createdAt]);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditSubmit = async (updatedTask) => {
    const { taskname, criticaltask, taskowner, duedate } = updatedTask;
    const taskownerinitials = getInitials(taskowner);
  
    // Update local state
    setTask((prevTask) => ({
      ...prevTask,
      taskname,
      criticaltask,
      taskowner,
      taskownerinitials,
      duedate: duedate || "NA", 
    }));
  
    try {
      // Update the database
      await db.todocollection.update(task.$id, {
        taskname,
        criticaltask,
        taskowner,
        taskownerinitials,
        duedate: duedate || null,
      });
  
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) =>
          note.$id === task.$id 
            ? { ...note, taskname, criticaltask, taskowner, taskownerinitials, duedate: duedate || "NA" } 
            : note
        );
        return updatedNotes.sort((a, b) => {
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
          if (a.criticaltask && !b.criticaltask) return -1;
          if (!a.criticaltask && b.criticaltask) return 1;
          return b.taskAge - a.taskAge || new Date(a.$createdAt) - new Date(b.$createdAt);
        });
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  
    // Close the modal after saving the task
    closeEditModal();
  };
  
  const handleUpdate = async () => {
    if (loading) return;

    const updatedCompletionStatus = !task.completed;
    setLoading(true);

    try {
      setAnimateRow(false); 
      setTimeout(() => setAnimateRow(true), 50); 

      setTask((prevTask) => ({ ...prevTask, completed: updatedCompletionStatus }));

      await db.todocollection.update(task.$id, { completed: updatedCompletionStatus });

      if (updatedCompletionStatus) {
        triggerHeaderTickAnimation();
      }

      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) =>
          note.$id === task.$id ? { ...note, completed: updatedCompletionStatus } : note
        );
        return updatedNotes.sort((a, b) => {
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
          if (a.criticaltask && !b.criticaltask) return -1;
          if (!a.criticaltask && b.criticaltask) return 1;
          return b.taskAge - a.taskAge || new Date(a.$createdAt) - new Date(b.$createdAt);
        });
      });
    } catch (error) {
      console.error("Error updating task:", error);
      setTask((prevTask) => ({ ...prevTask, completed: !updatedCompletionStatus }));
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = async () => {
    try {
      const tasks = await fetchUpdatedTasks(); // This is the function that fetches updated tasks
      setNotes(tasks); // Set the updated tasks to state
    } catch (error) {
      console.error("Error fetching updated tasks:", error);
    }
  };

  const handleStarToggle = async () => {
    if (!task.completed) return;

    const updatedPerfectStarStatus = !task.starred;
    setTask((prevTask) => ({ ...prevTask, starred: updatedPerfectStarStatus }));
    setAnimateStar(true);
    setTimeout(() => setAnimateStar(false), 600);

    try {
      await db.todocollection.update(task.$id, { Perfectstar: updatedPerfectStarStatus });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.$id === task.$id ? { ...note, starred: updatedPerfectStarStatus, Perfectstar: updatedPerfectStarStatus } : note
        )
      );
    } catch (error) {
      console.error("Error updating star status:", error);
      setTask((prevTask) => ({ ...prevTask, starred: !updatedPerfectStarStatus }));
    }
  };

  const handleDelete = async () => {
    try {
      await db.todocollection.delete(task.$id);
      setNotes((prev) => prev.filter((note) => note.$id !== task.$id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getEditIconColor = () => {
    switch (theme) {
      case "light":
        return "text-gray-800";
      case "dark":
        return "text-gray-100";
      case "green":
        return "text-gray-100";
      default:
        return "text-blue-500";
    }
  };

  const getBackgroundColor = (initials) => {
    const colorMap = {
      AM: "bg-red-500",
      NA: "bg-green-500",
      MP: "bg-blue-500",
      SK: "bg-yellow-700",
      MD: "bg-purple-500",
      SB: "bg-pink-500",
      RM: "bg-indigo-500",
      DB: "bg-teal-500",
      BH: "bg-orange-500",
      AS: "bg-cyan-500",
    };
    return colorMap[initials] || "bg-gray-500";
  };

  const getTaskAgeLabel = () => (taskAge === 1 ? `${taskAge} Day` : `${taskAge} Days`);

  return (
    <div className={`w-full mr- ${selectedFont} ${animateRow ? "animate-shrink-expand" : ""}`}>
      <div className={`flex justify-between items-center ${task.completed ? "text-green-700 italic" : "not-italic"}`}>
        <div className="flex items-center flex-1">
          {task.criticaltask ? (
            <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⚠️ CRITICAL
            </span>
          ) : (
            <span className="text-white bg-green-700 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⬜ NORMAL
            </span>
          )}
          <span className={`${task.completed ? "line-through" : ""} ml-4`}>{task.taskname}</span>
        </div>

        <div className="flex items-center space-x-5">
          {/* Due Date Field */}
          {task.duedate !== "NA" && (
            <span
              className={`flex items-center justify-center w-20 h-8 rounded-md bg-orange-600 text-white 
              mr-7 text-sm flex-shrink-0 text-center ${task.completed ? "italic line-through" : ""}`}
              title={`Due Date: ${new Date(task.duedate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}`}
            >
              {new Date(task.duedate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}

          {/* Star Icon */}
          <FaStar
            onClick={handleStarToggle}
            className={`cursor-pointer ${
              task.completed
                ? task.starred
                  ? "text-yellow-500 border border-black"
                  : "text-gray-400"
                : "text-gray-400 cursor-not-allowed"
            } text-2xl ${animateStar && task.starred ? "animate-rotate-twice" : ""}`}
            style={{ cursor: task.completed ? "pointer" : "not-allowed" }}
          />

          {/* Task Owner Initials */}
          <span
            className={`flex items-center justify-center w-9 h-8 rounded-xl ${getBackgroundColor(
              task.taskownerinitials
            )} text-white text-sm border border-gray-300 font-semibold`}
            title={task.taskowner}
            style={{ transform: "translateX(24px)" }}
          >
            {task.taskownerinitials}
          </span>

          {/* Task Owner Name */}
          <span
            className="flex items-center justify-center w-24 h-8 rounded-full bg-gray-300 text-gray-800 text-sm"
            title={task.taskowner}
          >
            {task.taskowner}
          </span>

          {/* Task Age Field */}
          <span
            className={`flex items-center justify-center w-20 h-8 rounded-xl bg-gray-700 text-white 
            text-sm  px-3 ${task.completed ? "italic line-through" : ""}`}
            title={`Task age: ${taskAge} days`}
          >
            {getTaskAgeLabel()}
          </span>

          <FaCheckCircle
            onClick={handleUpdate}
            className={`cursor-pointer ${task.completed ? "text-green-500" : "text-gray-500"} text-3xl`}
          />
          <FaPencilAlt onClick={openEditModal} className={`cursor-pointer ${getEditIconColor()}`} />
          <FaTrashAlt onClick={handleDelete} className="text-red-500 cursor-pointer ml-4" />
        </div>
      </div>

      {isEditModalOpen && (
        <EditTask
          task={task}  
          onSubmit={handleEditSubmit}
          onClose={closeEditModal}
          refreshTasks={refreshTasks}
          theme="light"
        />
      )}
    </div>
  );
}

export default Tasks;
