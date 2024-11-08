import React, { useState, useEffect } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt } from "react-icons/fa";

function Tasks({ taskData, setNotes, theme, selectedFont, triggerHeaderTickAnimation }) {
  const [task, setTask] = useState({
    ...taskData,
    taskowner: taskData.taskowner || "Unassigned",
    taskownerinitials: taskData.taskownerinitials || "NA",
  });
  const [loading, setLoading] = useState(false);
  const [taskAge, setTaskAge] = useState(0);
  const [animateRow, setAnimateRow] = useState(false); // State for row animation

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

  const handleUpdate = async () => {
    if (loading) return;

    const updatedCompletionStatus = !task.completed;

    setTask((prevTask) => ({ ...prevTask, completed: updatedCompletionStatus }));
    setLoading(true);

    try {
      await db.todocollection.update(task.$id, { completed: updatedCompletionStatus });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.$id === task.$id ? { ...note, completed: updatedCompletionStatus } : note
        )
      );

      if (updatedCompletionStatus) {
        triggerHeaderTickAnimation();
        setAnimateRow(true); // Trigger the shrink-expand animation
        setTimeout(() => setAnimateRow(false), 300); // Remove animation class after it completes
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setTask((prevTask) => ({ ...prevTask, completed: !updatedCompletionStatus }));
    } finally {
      setLoading(false);
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
      case 'light':
        return 'text-gray-800';
      case 'dark':
        return 'text-gray-100';
      case 'green':
        return 'text-gray-100';
      default:
        return 'text-blue-500';
    }
  };

  const getBackgroundColor = (initials) => {
    const colorMap = {
      AM: 'bg-red-500',
      NA: 'bg-green-500',
      MP: 'bg-blue-500',
      SK: 'bg-yellow-700',
      MD: 'bg-purple-500',
      SB: 'bg-pink-500',
      RM: 'bg-indigo-500',
      DB: 'bg-teal-500',
      BH: 'bg-orange-500',
      AS: 'bg-cyan-500',
    };
    return colorMap[initials] || 'bg-gray-500';
  };

  const getTaskAgeLabel = () => (taskAge === 1 ? `${taskAge} Day` : `${taskAge} Days`);

  return (
    <div className={`w-full mr-2 ${selectedFont} ${animateRow ? 'animate-shrink-expand' : ''}`}>
      <div className={`flex justify-between items-center ${task.completed ? 'text-green-700 italic' : 'not-italic'}`}>
        <div className="flex items-center flex-1">
          {task.criticaltask && (
            <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⚠️ CRITICAL TASK
            </span>
          )}
          <span onClick={handleUpdate} className="cursor-pointer">
            {task.completed ? <s>{task.taskname}</s> : <>{task.taskname}</>}
          </span>
        </div>

        <div className="flex items-center space-x-5">
          <span
            className={`flex items-center justify-center w-25 h-8 rounded-xl bg-gray-700 text-white 
            text-sm font-semibold px-3 ${task.completed ? 'italic line-through' : ''}`}
            title={`Task age: ${taskAge} days`}
          >
            {getTaskAgeLabel()}
          </span>
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full ${getBackgroundColor(task.taskownerinitials)} text-white text-sm 
            border border-gray-300 font-semibold`}
            title={task.taskowner}
          >
            {task.taskownerinitials}
          </span>
          <span
            className="flex items-center justify-center w-28 h-8 rounded-full bg-gray-300 text-gray-800 text-sm"
            title={task.taskowner}
          >
            {task.taskowner}
          </span>
          <FaPencilAlt onClick={() => console.log('Edit task')} className={`cursor-pointer ${getEditIconColor()}`} />
          <FaCheckCircle
            onClick={handleUpdate}
            className={`cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-500'} text-3xl`}
          />
          <FaTrashAlt onClick={handleDelete} className="text-red-500 cursor-pointer ml-4" />
        </div>
      </div>
    </div>
  );
}

export default Tasks;
