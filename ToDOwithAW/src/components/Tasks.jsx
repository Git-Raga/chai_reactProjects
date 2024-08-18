import React, { useState } from "react";
import db from "../appwrite/database";
import { FaTrashAlt } from "react-icons/fa";

function Tasks({ taskData, setNotes }) {
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

  return (
    <div className="flex justify-between items-center w-full">
      <span onClick={handleUpdate} className="cursor-pointer">
        {task.completed ? <s>{task.taskname}</s> : <>{task.taskname}</>}
      </span>
      <FaTrashAlt 
        onClick={handleDelete} 
        className="text-red-500 cursor-pointer ml-4" 
      />
    </div>
  );
}

export default Tasks;
