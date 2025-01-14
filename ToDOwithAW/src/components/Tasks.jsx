// File: src/components/Tasks.jsx

import React, { useEffect, useState } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt, FaStar } from "react-icons/fa";

function Tasks({ taskData, setNotes, theme, selectedFont, triggerHeaderTickAnimation, onSaveTask, onEdit }) {
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

  const [taskAge, setTaskAge] = useState(0);

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

  const latetask = (() => {
    if (!taskData.duedate || taskData.duedate === "NA") return false;
    const currentDate = new Date();
    const dueDateObj = new Date(taskData.duedate);
    return currentDate > dueDateObj;
  })();

  const starred = taskData.Perfectstar || false;
  const completed = taskData.completed || false;
  const taskowner = taskData.taskowner || "Unassigned";
  const taskownerinitials = getInitials(taskowner);

  const handleUpdate = async () => {
    const newCompleted = !completed;
    try {
      await db.todocollection.update(taskData.$id, { completed: newCompleted });
      if (newCompleted) {
        triggerHeaderTickAnimation();
      }
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.$id === taskData.$id ? { ...note, completed: newCompleted } : note
        )
      );
    } catch (error) {
      console.error("Error toggling completed:", error);
    }
  };

  const handleStarToggle = async () => {
    if (!completed) return;

    const newStarValue = !starred;
    try {
      await db.todocollection.update(taskData.$id, { Perfectstar: newStarValue });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.$id === taskData.$id ? { ...note, Perfectstar: newStarValue } : note
        )
      );
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await db.todocollection.delete(taskData.$id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== taskData.$id));
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

  return (
    <div className={`w-full ${selectedFont}`}>
      <div className={`flex justify-between items-center ${completed ? "text-green-700 italic" : "not-italic"}`}>
        {/* Left side: CRITICAL-LATE or NORMAL-LATE badges */}
        <div className="flex items-center flex-1">
          {latetask ? (
            taskData.criticaltask ? (
              <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold blink">
                ⚠️ CRITICAL-LATE
              </span>
            ) : (
              <span className="text-white bg-red-600 px-2 py-1 rounded mr-2 text-xs font-semibold">
                ⬜ NORMAL-LATE
              </span>
            )
          ) : taskData.criticaltask ? (
            <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⚠️ CRITICAL
            </span>
          ) : (
            <span className="text-white bg-green-700 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⬜ NORMAL
            </span>
          )}
          <span className={`${completed ? "line-through" : ""} ml-4`}>
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

          {/* Star icon */}
          <FaStar
            onClick={handleStarToggle}
            className={`cursor-pointer ${
              completed
                ? starred
                  ? "text-yellow-500 border border-black"
                  : "text-gray-400"
                : "text-gray-400 cursor-not-allowed"
            } text-2xl`}
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
