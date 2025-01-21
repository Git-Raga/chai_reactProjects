// File: src/components/Tasks.jsx

import React, { useEffect, useState } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt, FaStar } from "react-icons/fa";

function Tasks({ taskData, setNotes, theme, selectedFont, triggerHeaderTickAnimation, onSaveTask, onEdit, setTotalTasks }) {
  const getInitials = (ownerName) => {
    const initialsMap = {
      "Abhishek": "AM",
      "Neha": "NA",
      "Mahima": "MP",
      "Suresh": "SK",
      "Muskan": "MD",
      "Swetha": "SB",
      "Raghav M": "RM",
      "Dileep": "DB",
      "Bhaskar": "BM",
      "Architha": "AS",
    };
    return initialsMap[ownerName] || "NA";
  };

 
  

  const [task, setTask] = useState({
    ...taskData,
    taskowner: taskData.taskowner || "Unassigned",
    taskownerinitials: getInitials(taskData.taskowner || "Unassigned"),
    starred: taskData.Perfectstar || false,
    duedate: taskData.duedate || "NA", // Set "NA" if duedate is null or not set
  });
  
  const [taskAge, setTaskAge] = useState(0);  
  const [animateStar, setAnimateStar] = useState(false);
  const [animateRow, setAnimateRow] = useState(false);

  useEffect(() => {
    if (taskData.$createdAt) {
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
      setTaskAge(calculateTaskAge(taskData.$createdAt));
    }
  }, [taskData.$createdAt]);

  useEffect(() => {
    setTask({
      ...taskData,
      taskowner: taskData.taskowner || "Unassigned",
      taskownerinitials: getInitials(taskData.taskowner || "Unassigned"),
      starred: taskData.Perfectstar || false,
      duedate: taskData.duedate || "NA",
    });
  }, [taskData]);

  const latetask = (() => {
    if (!taskData.duedate || taskData.duedate === "NA") return false;
    const currentDate = new Date();
    const dueDateObj = new Date(taskData.duedate);
    return currentDate > dueDateObj;
  })();
  const [loading, setLoading] = useState(false);
  const starred = taskData.Perfectstar || false;
  const completed = taskData.completed || false;
  const taskowner = taskData.taskowner || "Unassigned";
  const taskownerinitials = getInitials(taskowner);
  
  const handleUpdate = async () => {
    if (loading) return;
  
    const updatedCompletionStatus = !task.completed;
    setTask((prevTask) => ({ ...prevTask, completed: updatedCompletionStatus }));
    setLoading(true);
  
    if (!task.completed) {
      // Trigger row animation only when transitioning from incomplete to complete
      setAnimateRow(true);
      setTimeout(async () => {
        setAnimateRow(false);
  
        try {
          // Update the database after the animation finishes
          await db.todocollection.update(task.$id, { completed: updatedCompletionStatus });
  
          if (updatedCompletionStatus) {
            triggerHeaderTickAnimation();
          }
  
          // Update the state with the new task completion status
          setNotes((prevNotes) => {
            const updatedNotes = prevNotes
              ? prevNotes.map((note) =>
                  note.$id === task.$id
                    ? { ...note, completed: updatedCompletionStatus }
                    : note
                )
              : []; // Ensure prevNotes is never undefined
            return updatedNotes;
          });
        } catch (error) {
          console.error("Error updating task:", error);
          setTask((prevTask) => ({ ...prevTask, completed: !updatedCompletionStatus }));
        } finally {
          setLoading(false);
        }
      }, 1200); // Ensure the timeout matches the animation duration
    } else {
      // Directly update the database and UI without animation when transitioning to incomplete
      try {
        await db.todocollection.update(task.$id, { completed: updatedCompletionStatus });
  
        // Update the state with the new task completion status
        setNotes((prevNotes) => {
          const updatedNotes = prevNotes
            ? prevNotes.map((note) =>
                note.$id === task.$id
                  ? { ...note, completed: updatedCompletionStatus }
                  : note
              )
            : []; // Ensure prevNotes is never undefined
          return updatedNotes;
        });
      } catch (error) {
        console.error("Error updating task:", error);
        setTask((prevTask) => ({ ...prevTask, completed: !updatedCompletionStatus }));
      } finally {
        setLoading(false);
      }
    }
  };
  
  

// Updated handleStarToggle function
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
      // Delete the task from the database
      await db.todocollection.delete(taskData.$id);
      
      // Update the notes state to remove the deleted task
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.filter((note) => note.$id !== taskData.$id);
        setTotalTasks(updatedNotes.length); // Update totalTasks with the new length of the notes
        return updatedNotes;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  const getEditIconColor = () => {
    switch (theme) {
      case "light": return "text-gray-800";
      case "dark": return "text-gray-100";
      case "green": return "text-gray-100";
      default: return "text-blue-500";
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
  const getBackgroundColor4completed = () => {
    return completed ? "bg-slate-600 text-slate-400" : ""; 
  };
  return (
    
    <div
    className={`w-full h-auto p-0 mr-2 ${selectedFont} ${animateRow ? 'animate-shrink-expand' : ''} ${getBackgroundColor4completed()}`}
  >
  
  <div className="flex justify-between items-center">
  {/* Left side: CRITICAL-LATE or NORMAL-LATE badges */}
  <div className="flex items-center text-center flex-1">
    {latetask ? (
      taskData.criticaltask ? (
        <span
          className={`text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold w-32 ${
            !completed ? "blink" : ""
          }`}
        >
          ⚠️ CRITICAL-LATE
        </span>
      ) : (
        <span className="text-white bg-red-600 px-2 py-1 rounded mr-2 text-xs font-semibold w-32">
          ⬜ NORMAL-LATE
        </span>
      )
    ) : taskData.criticaltask ? (
      <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold w-32">
        ⚠️ CRITICAL
      </span>
    ) : (
      <span className="text-white bg-green-700 px-2 py-1 rounded mr-2 text-xs font-semibold w-32">
        ⬜ NORMAL
      </span>
    )}
 


 <span
  className={`${completed ? "line-through" : ""}`}
  style={{
    display: "inline-block", // Ensures it's treated like a block for proper alignment
    width: "500px", // Fixed width for alignment
    overflow: "hidden", // Optional: handles text overflow if necessary
    whiteSpace: "nowrap", // Optional: prevents text wrapping
    textIndent: "20px",
    textAlign:"left"
  }}
>
  {taskData.taskname}
</span>
        </div>

        {/* Right side: due date, star, owner, age, icons */}
        <div className="flex items-center space-x-5">
          {/* Due date badge */}
          {taskData.duedate && taskData.duedate !== "NA" && (
            <span
              className={`flex items-center justify-center w-20 h-8 rounded-md ${
                latetask ? "bg-red-600 text-white" : "bg-orange-600 text-white"
              } mr-7 text-sm flex-shrink-0 text-center ${completed ? "italic line-through" : ""}`}
              title={`Due Date: ${new Date(taskData.duedate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}`}
            >
              {new Date(taskData.duedate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}

              <FaStar
                onClick={task.completed ? handleStarToggle : null} // Only allow toggle for completed tasks
                className={`cursor-pointer ${
                  task.completed
                    ? task.starred
                      ? 'text-yellow-500 border border-black'
                      : 'text-gray-400'
                    : 'text-gray-400 cursor-not-allowed'
                } text-2xl ${animateStar && task.starred ? 'animate-rotate-twice' : ''}`}
                style={{ cursor: task.completed ? 'pointer' : 'not-allowed' }}
              />



          {/* Owner initials */}
          <span
            className={`flex items-center justify-center w-9 h-8 rounded-xl ${getBackgroundColor(
              taskownerinitials
            )} text-white text-sm border border-gray-300 font-semibold`}
            title={taskowner}
            style={{ transform: "translateX(24px)" }}
          >
            {taskownerinitials}
          </span>

          {/* Owner full name */}
          <span
            className="flex items-center justify-center w-24 h-8 rounded-full bg-gray-300 text-gray-800 text-sm"
            title={taskowner}
          >
            {taskowner}
          </span>

          {/* Task age */}
          <span
            className={`flex items-center justify-center w-20 h-8 rounded-xl bg-gray-700 text-white text-sm px-3 ${
              completed ? "italic line-through" : ""
            }`}
            title={`Task age: ${taskAge} days`}
          >
            {taskAge === 1 ? `${taskAge} Day` : `${taskAge} Days`}
          </span>

          {/* Checkmark (toggle completion) */}
          <FaCheckCircle
            onClick={handleUpdate}
            className={`cursor-pointer ${completed ? "text-green-500" : "text-gray-500"} text-3xl`}
          />

          {/* Edit button */}
          <FaPencilAlt 
            onClick={() => onEdit(taskData)}
            className={`cursor-pointer ${getEditIconColor()}`} />

          {/* Delete button */}
          <FaTrashAlt onClick={handleDelete} className="text-red-500 cursor-pointer ml-4" />
        </div>
      </div>
    </div>
  );
}

export default Tasks;
