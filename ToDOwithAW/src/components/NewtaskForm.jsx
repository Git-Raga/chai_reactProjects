import React, { useState, useRef } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass, theme }) {
  const [error, setError] = useState(null);
  const [isCritical, setIsCritical] = useState(false); // State for the checkbox
  const maxLength = 255; // Example max length for the input
  const formRef = useRef(null); // Create a ref for the form
  const [selectedTaskOwner, setSelectedTaskOwner] = useState("TaskOwner?");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for toggling dropdown

  const taskOwners = [
    "TaskOwner?",
    "Mahima",
    "Suresh",
    "Abhishek",
    "Muskan",
    "Swetha",
    "Raghav M",
    "Dileep",
    "Bhaskar",
    "Architha",
    "Neha",
  ];

  // Theme-based dropdown background and text colors
  const dropdownColors = {
    light: {
      bg: "bg-gray-100",
      text: "text-black",
      hover: "hover:bg-gray-200",
      selected: "bg-gray-300 text-black", // Text in black for light background
    },
    dark: {
      bg: "bg-gray-700",
      text: "text-white",
      hover: "hover:bg-gray-600",
      selected: "bg-gray-500 text-white", // White text for selected item with a darker background
    },
    green: {
      bg: "bg-cyan-700",
      text: "text-teal-100",
      hover: "hover:bg-teal-500",
      selected: "bg-teal-800 text-teal-100", // Same teal text but on a darker background
    },
  };
  

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const newTaskText = formData.get("newtaskbody");
    const taskOwner = selectedTaskOwner;

    let tskini = "";
    switch (taskOwner) {
      // Cases for initials assignment (omitted for brevity)
      case "Abhishek":
        tskini = "AM";
        break;
      case "Neha":
        tskini = "NA";
        break;
      case "Mahima":
        tskini = "MP";
        break;
      case "Suresh":
        tskini = "SK";
        break;
      case "Muskan":
        tskini = "MD";
        break;
      case "Swetha":
        tskini = "SB";
        break;
      case "Raghav M":
        tskini = "RM";
        break;
      case "Dileep":
        tskini = "DB";
        break;
      case "Bhaskar":
        tskini = "BH";
        break;
      case "Architha":
        tskini = "AS";
        break;
      default:
        tskini = "";
    }

    if (newTaskText === "") {
      setError("Task cannot be empty");
      setTimeout(() => setError(null), 1000); // Clear the error after 3 seconds
      return;
    }

    if (newTaskText.length > maxLength) {
      setError(`Task cannot exceed ${maxLength} characters`);
      setTimeout(() => setError(null), 2000); // Clear the error after 3 seconds
      return;
    }

    if (taskOwner === "TaskOwner?") {
      setError("Task owner not assigned");
      setTimeout(() => setError(null), 2000); // Clear the error after 3 seconds
      return;
    }

    try {
      const payload = {
        taskname: newTaskText,
        criticaltask: isCritical,
        taskowner: taskOwner,
        taskownerinitials: tskini, // Include the initials
      };

      const response = await db.todocollection.create(payload);
      if (response) {
        setNotes((prevState) => [response, ...prevState]);
        formRef.current.reset(); // Reset the form using the ref
        setIsCritical(false); // Reset checkbox state on submission
        setSelectedTaskOwner("TaskOwner?"); // Reset dropdown
        setError(null); // Clear any previous error on successful submission
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 2000); // Clear the error after 3 seconds
    }
  };

  const handleCheckboxClick = () => {
    setIsCritical((prev) => !prev); // Toggle critical state
  };

  // Theme-based input border and outline colors
  const inputFocusClasses = {
    light: "focus:ring-black focus:border-black",
    dark: "focus:ring-gray-400 focus:border-gray-400",
    green: "focus:ring-teal-600 focus:border-teal-600",
  };

  // Apply button background colors based on theme
  const buttonBackgroundColor = {
    light: "bg-gray-600 hover:bg-gray-900 text-white",
    dark: "bg-white hover:bg-gray-400 text-black",
    green: "bg-teal-700 hover:bg-teal-600 text-teal-100",
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        className="font-bold rounded-2xl font-mono border-gray-400 border-2 mt-1 mb-3 flex items-center gap-2"
        onSubmit={handleAdd}
        id="todo-form"
      >
        {/* Input for task */}
        <input
          type="text"
          name="newtaskbody"
          placeholder="🤔 What's the next task?"
          maxLength={maxLength}
          className={`p-2 mt-1 mb-1 ml-1 text-xl text-center flex-grow rounded-3xl ${inputClass} focus:outline-none focus:ring-2 ${inputFocusClasses[theme]}`}
        />

        {/* Custom Dropdown for Task Owners */}
        <div className="relative inline-block w-1/6">
  <div
    className={`p-2 mt-1 mb-1 ml-1 text-center flex-none w-full rounded-2xl cursor-pointer ${dropdownColors[theme].bg} ${dropdownColors[theme].text}`}
    onClick={() => setDropdownOpen((prev) => !prev)}
  >
    {selectedTaskOwner}
  </div>

  {/* Dropdown Options (shown when clicked) */}
  {dropdownOpen && (
    <ul className={`absolute z-10 border border-gray-300 mt-1 w-full rounded-lg shadow-lg ${dropdownColors[theme].bg}`}>
      {taskOwners.map((owner, idx) => (
        <li
          key={idx}
          onClick={() => {
            setSelectedTaskOwner(owner);
            setDropdownOpen(false);
          }}
          className={`px-4 py-2 cursor-pointer ${dropdownColors[theme].text} ${dropdownColors[theme].hover} font-mono ${
            owner === selectedTaskOwner ? dropdownColors[theme].selected : ""
          }`}
        >
          {owner}
        </li>
      ))}
    </ul>
  )}
</div>

        {/* Checkbox for Critical Task */}
        <div
          className={`rounded-3xl text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${inputClass}`}
          onClick={handleCheckboxClick}
          title="Set as CRITICAL Task"
        >
          <input
            type="checkbox"
            id="critical"
            name="critical"
            checked={isCritical}
            onChange={() => {}}
            className="mr-1 text-red-500 h-3 w-6 appearance-none border-2 border-gray-300 rounded checked:bg-red-500 checked:border-red-500"
          />
          <label
            htmlFor="critical"
            className="text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            ❗
          </label>
        </div>

        {/* Submit button */}
        <div
          className={`rounded-xl border-2 text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${buttonBackgroundColor[theme]}`}
          title="Add Task"
        >
          <button
            type="submit"
            className="text-sm cursor-pointer"
          >
            AddTask ⬇
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center w-full mt-2">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

export default NewtaskForm;
