import React, { useState } from "react";
import db from "../appwrite/database";
import { FaTrashAlt, FaCheckCircle, FaPencilAlt } from "react-icons/fa";

function Tasks({ taskData, setNotes, theme, selectedFont }) {  // Accepting theme and selectedFont as props
  const [task, setTask] = useState(taskData);
  const [loading, setLoading] = useState(false);

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

  return (
    <div
      className={`flex justify-between items-center w-full 
        ${selectedFont}  // Applying the selected font dynamically
        ${task.completed ? 'text-blue-300 italic' : 'not-italic'}`}
    >
      <span onClick={handleUpdate} className="cursor-pointer">
        {task.completed ? <s>{task.taskname}</s> : <>{task.taskname}</>}
      </span>

      <div className="flex items-center space-x-5">
        <FaPencilAlt
          onClick={() => console.log('Edit task')}
          className={`cursor-pointer ${getEditIconColor()}`}
        />
        <FaCheckCircle
          onClick={handleUpdate}
          className={`cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-500'}
          text-2xl`}
        />
        <FaTrashAlt
          onClick={handleDelete}
          className="text-red-500 cursor-pointer ml-4"
        />
      </div>
    </div>
  );
}

export default Tasks;
