import React, { useState } from "react";

function EditTask({ task, onSubmit, onClose, theme }) {
  const [taskName, setTaskName] = useState(task.taskname || "");
  const [isCritical, setIsCritical] = useState(task.criticaltask || false);
  const [taskOwner, setTaskOwner] = useState(task.taskowner || "Unassigned");

  const handleToggleCritical = () => setIsCritical((prev) => !prev);
  
  const handleSave = () => {
    onSubmit({
      taskname: taskName,
      criticaltask: isCritical,
      taskowner: taskOwner,
    });
    onClose();
  };

  const themeStyles = {
    light: {
      text: "text-gray-800",
      inputBg: "bg-gray-200",
      buttonBg: "bg-blue-500",
      buttonText: "text-white",
      toggleYes: "bg-red-500 text-white",
      toggleNo: "bg-gray-300 text-gray-800",
      dropdownBg: "bg-gray-200 text-gray-800",
    },
    dark: {
      text: "text-black",
      inputBg: "bg-gray-800 text-white",
      buttonBg: "bg-blue-600",
      buttonText: "text-white",
      toggleYes: "bg-red-600 text-white",
      toggleNo: "bg-gray-600 text-white",
      dropdownBg: "bg-gray-800 text-white",
    },
    green: {
      text: "text-teal-900",
      inputBg: "bg-cyan-800 text-teal-50",
      buttonBg: "bg-teal-500",
      buttonText: "text-white",
      toggleYes: "bg-teal-700 text-white",
      toggleNo: "bg-teal-600 text-teal-100",
      dropdownBg: "bg-cyan-800 text-teal-100",
    },
  };

  const styles = themeStyles[theme] || themeStyles.light;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className={`text-2xl font-bold mb-4 ${styles.text}`}>Edit Task</h2>

        <label className={`${styles.text} block mb-2`}>Task Name:</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={`w-full p-2 rounded-md mb-4 ${styles.inputBg} ${styles.text}`}
        />

        <label className={`${styles.text} block mb-2`}>Critical Task:</label>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleToggleCritical}
            className={`px-4 py-2 rounded-md ${
              isCritical ? styles.toggleYes : styles.toggleNo
            }`}
          >
            {isCritical ? "Yes" : "No"}
          </button>
        </div>

        <label className={`${styles.text} block mb-2`}>Task Owner:</label>
        <select
          value={taskOwner}
          onChange={(e) => setTaskOwner(e.target.value)}
          className={`w-full p-2 rounded-md mb-4 ${styles.dropdownBg}`}
        >
          <option>Abhishek</option>
          <option>Neha</option>
          <option>Mahima</option>
          <option>Suresh</option>
          <option>Muskan</option>
          <option>Swetha</option>
          <option>Raghav M</option>
          <option>Dileep</option>
          <option>Bhaskar</option>
          <option>Architha</option>
     
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-md ${styles.buttonBg} ${styles.buttonText}`}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md bg-gray-400 text-gray-800`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
