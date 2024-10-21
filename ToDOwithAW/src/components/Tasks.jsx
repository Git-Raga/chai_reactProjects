import React, { useState, useEffect } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt } from "react-icons/fa";

function Tasks({ taskData, setNotes, theme, selectedFont }) {
  const [task, setTask] = useState(taskData);
  const [loading, setLoading] = useState(false);
  const [taskAge, setTaskAge] = useState(0);  // State to hold the task age

  useEffect(() => {
    // Function to calculate the task age in calendar days excluding weekends
    const calculateTaskAge = (timestamp) => {
      const startDate = new Date(timestamp);
      const today = new Date();
      let dayCount = 0;

      // Ensure startDate is valid
      if (isNaN(startDate)) {
        console.error("Invalid timestamp format:", timestamp);
        return 0;
      }

      // Iterate through each day from startDate to today
      for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        // Count only weekdays (Monday to Friday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // 0 = Sunday, 6 = Saturday
          dayCount++;
        }
      }

      return dayCount;
    };

    // Set the task age based on the 'Created' timestamp from the task data
    if (taskData.$createdAt) {  // Appwrite's default created timestamp field
      const age = calculateTaskAge(taskData.$createdAt);
      setTaskAge(age);
    }
  }, [taskData.$createdAt]);

  const handleUpdate = async () => {
    const taskdone = !task.completed;

    setTask({ ...task, completed: taskdone });
    setLoading(true);

    try {
      await db.todocollection.update(task.$id, { completed: taskdone });
    } catch (error) {
      console.error("Error updating task:", error);
      setTask({ ...task, completed: !taskdone });
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

  // Determine the color of the edit icon based on the theme
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

  // Assign a background color based on the task owner's initials
  const getBackgroundColor = (initials) => {
    if (initials === "AM") {
      return 'bg-red-500';
    } else if (initials === "NA") {
      return 'bg-green-500';
    } else if (initials === "MP") {
      return 'bg-blue-500';
    } else if (initials === "SK") {
      return 'bg-yellow-700';
    } else if (initials === "MD") {
      return 'bg-purple-500';
    } else if (initials === "SB") {
      return 'bg-pink-500';
    } else if (initials === "RM") {
      return 'bg-indigo-500';
    } else if (initials === "DB") {
      return 'bg-teal-500';
    } else if (initials === "BH") {
      return 'bg-orange-500';
    } else if (initials === "AS") {
      return 'bg-cyan-500';
    } else {
      return 'bg-gray-500'; // Default color if no match
    }
  };

  // Function to return the correct label for task age
  const getTaskAgeLabel = () => {
    if (taskAge === 1) {
      return `${taskAge} Day`;
    } else {
      return `${taskAge} ${taskAge === 0 ? 'Day' : 'Days'}`;
    }
  };

  return (
    <div className={`w-full mr-2 ${selectedFont}`}>
      <div
        className={`flex justify-between items-center
          ${task.completed ? 'text-green-700 italic' : 'not-italic'}`}
      >
        <div className="flex items-center flex-1">
          {task.criticaltask && (
            <span className="text-white bg-red-800 px-2 py-1 rounded mr-2 text-xs font-semibold">
              ⚠️  CRITICAL TASK
            </span>
          )}
          <span onClick={handleUpdate} className="cursor-pointer">
            {task.completed ? <s>{task.taskname}</s> : <>{task.taskname}</>}
          </span>
        </div>

        <div className="flex items-center space-x-5">
          <span 
            className="flex items-center justify-center w-25 h-8 rounded-xl bg-gray-700 text-white 
            text-sm font-semibold px-3"
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
            {` ${task.taskowner} `}
          </span>
          <FaPencilAlt
            onClick={() => console.log('Edit task')}
            className={`cursor-pointer ${getEditIconColor()}`}
          />
          <FaCheckCircle
            onClick={handleUpdate}
            className={`cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-500'} text-2xl`}
          />
          <FaTrashAlt
            onClick={handleDelete}
            className="text-red-500 cursor-pointer ml-4"
          />
        </div>
      </div>
    </div>
  );
}

export default Tasks;
