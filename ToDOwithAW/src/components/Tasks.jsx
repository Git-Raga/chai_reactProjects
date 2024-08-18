import React, { useState } from "react";
import db from "../appwrite/database";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaPencilAlt} from "react-icons/fa";  // Highlighted: Importing the "edit" icon

function Tasks({ taskData, setNotes, theme }) {  // Highlighted: Accepting theme as a prop
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
      setNotes(prev => prev.filter(note => note.$id !== task.$id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Highlighted: Determine the color of the edit icon based on the theme
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
      className={`flex justify-between items-center w-full font-mono
        ${task.completed ? 'text-blue-300 italic' : 'not-italic'}`}  
    >
      <span onClick={handleUpdate} className="cursor-pointer">
        {task.completed ? <s>{task.taskname}</s> : <>{task.taskname}</>}
      </span>

      <div className="flex items-center space-x-5">  
        <FaPencilAlt  // Highlighted: Applying the dynamic color class
          onClick={() => console.log('Edit task')} 
          className={`cursor-pointer ${getEditIconColor()}`} 
        />
        <FaCheckCircle  
          onClick={handleUpdate} 
          className={`cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-500'}`} 
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
