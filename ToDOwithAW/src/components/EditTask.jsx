import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import db from "../appwrite/database";

function EditTask({ 
  task, 
  onClose, 
  onSubmit,  // optional callback to parent
  theme 
}) {
  // Our local states for editing
  const [taskName, setTaskName] = useState(task.taskname || "");
  const [isCritical, setIsCritical] = useState(task.criticaltask || false);
  const [taskOwner, setTaskOwner] = useState(task.taskowner || "Unassigned");
  
  const [duedate, setDuedate] = useState(() => {
    if (!task.duedate || task.duedate === "NA") return null;
    return new Date(task.duedate);
  });

  // If you actually want to allow editing of "Perfectstar" here, you can keep it:
  const [isStarred, setIsStarred] = useState(!!task.Perfectstar);

  const taskOwners = [
    "Abhishek",
    "Neha",
    "Mahima",
    "Suresh",
    "Muskan",
    "Swetha",
    "Raghav M",
    "Dileep",
    "Bhaskar",
    "Architha",
  ];

  const handleToggleCritical = () => setIsCritical((prev) => !prev);
  const handleToggleStarred = () => setIsStarred((prev) => !prev);

  const handleSave = async () => {
    // Construct the update object, including $id
    const updatedFields = {
    
      taskname: taskName,
      criticaltask: isCritical,
      taskowner: taskOwner,
      duedate: duedate ? duedate.toISOString() : null,
      Perfectstar: isStarred,
    };
  
    console.log("Saving updated fields:", updatedFields);
  
    try {
      // Update the doc in Appwrite
      const response = await db.todocollection.update(task.$id, updatedFields);
      console.log("Task updated in Appwrite:", response);
  
      // Pass the updated task back to the parent component
      if (onSubmit) {
        // Pass the full updated task (response) instead of just the fields
        onSubmit(response);
      }
    } catch (error) {
      console.error("Error updating task in EditTask:", error);
      alert("Failed to update the task!");
    }
  
    // Close the modal
    onClose();
  };

   
  
  // Optional theming
  const themeStyles = {
    light: {
      text: "text-gray-800",
      inputBg: "bg-gray-200",
      buttonBg: "bg-blue-500",
      buttonText: "text-white",
      toggleYes: "bg-red-500 text-white",
      toggleNo: "bg-gray-300 text-gray-800",
      dropdownBg: "bg-gray-200 text-gray-800",
      taskNameBg: "bg-gray-100",
      taskNameText: "text-gray-800",
      dueDateBg: "bg-gray-200",
      dueDateText: "text-gray-800",
    },
    // Additional themes if you want...
  };

  const styles = themeStyles[theme] || themeStyles.light;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className={`text-2xl font-bold mb-4 ${styles.text}`}>Edit Task</h2>

        {/* Task Name */}
        <label className={`${styles.text} block mb-2`}>Task Name:</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={`w-full p-2 rounded-md mb-4 ${styles.taskNameBg} ${styles.taskNameText}`}
        />

        {/* Critical Task */}
        <label className={`${styles.text} block mb-2`}>Critical Task:</label>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleToggleCritical}
            className={`px-4 py-2 rounded-md ${isCritical ? styles.toggleYes : styles.toggleNo}`}
          >
            {isCritical ? "Yes" : "No"}
          </button>
        </div>

        {/* Perfect Star */}
        {/*
        <label className={`${styles.text} block mb-2`}>Starred (Perfectstar):</label>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleToggleStarred}
            className={`px-4 py-2 rounded-md ${isStarred ? styles.toggleYes : styles.toggleNo}`}
          >
            {isStarred ? "Yes" : "No"}
          </button>
        </div>
        */}

        {/* Task Owner */}
        <label className={`${styles.text} block mb-2`}>Task Owner:</label>
        <select
          value={taskOwner}
          onChange={(e) => setTaskOwner(e.target.value)}
          className={`w-full p-2 rounded-md mb-4 ${styles.dropdownBg}`}
        >
          {taskOwners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>

        {/* Due Date */}
        <label className={`${styles.text} block mb-2`}>Due Date:</label>
        <DatePicker
          selected={duedate}
          onChange={(date) => setDuedate(date)}
          isClearable
          placeholderText="Select a date"
          className={`w-full p-2 rounded-md mb-4 border border-gray-300 ${styles.dueDateBg} ${styles.dueDateText}`}
        />

        {/* Save & Cancel Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-md ${styles.buttonBg} ${styles.buttonText}`}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
