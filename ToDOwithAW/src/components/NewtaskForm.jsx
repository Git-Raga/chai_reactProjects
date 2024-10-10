import React, { useState, useRef } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass, theme }) {
  const [error, setError] = useState(null);
  const [isCritical, setIsCritical] = useState(false); // State for the checkbox
  const maxLength = 255; // Example max length for the input
  const formRef = useRef(null); // Create a ref for the form
 

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current); // Use the ref to get the form element
    const newTaskText = formData.get("newtaskbody");
    const taskOwner = formData.get("taskOwner");

    // Determine initials based on the task owner
    let tskini = "";
    switch (taskOwner) {
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

    if (taskOwner === " ") {
      // Check if the task owner is not selected
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

      // Attempt to create the task
      const response = await db.todocollection.create(payload);

      if (response) {
        // Task created successfully
        setNotes((prevState) => [response, ...prevState]);
        formRef.current.reset(); // Reset the form using the ref
        setIsCritical(false); // Reset checkbox state on submission
        setError(null); // Clear any previous error on successful submission
      } else {
        // If no response, show error
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 2000); // Clear the error after 3 seconds
    }
  };

  const handleCheckboxClick = () => {
    setIsCritical((prev) => !prev); // Toggle the critical state
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
        ref={formRef} // Attach the ref to the form
        className="font-bold rounded-2xl 
        font-mono border-gray-400 border-2 mt-1 mb-3 flex items-center gap-2"
        onSubmit={handleAdd}
        id="todo-form"
      >
        {/* Adjusted input styling */}
        <input
          type="text"
          name="newtaskbody"
          placeholder="🤔 Bring it on...What's the next task?"
          maxLength={maxLength}
          className={`p-2 mt-1 mb-1 ml-1 text-xl text-center flex-grow rounded-3xl ${inputClass}`}
        />
        {/* Updated Dropdown for Owners */}
        <select
          name="taskOwner" // Added name attribute for reference in handleAdd
          className={`p-2 mt-1 mb-1 ml-1 text-center flex-none w-1/6 
            rounded-2xl ${inputClass} text-m`}
        >
          <option value=" ">TaskOwner?</option>
          <option value="Mahima">Mahima</option>
          <option value="Suresh">Suresh</option>
          <option value="Abhishek">Abhishek</option>
          <option value="Muskan">Muskan</option>
          <option value="Swetha">Swetha</option>
          <option value="Raghav M">Raghav M</option>
          <option value="Dileep">Dileep</option>
          <option value="Bhaskar">Bhaskar</option>
          <option value="Architha">Architha</option>
          <option value="Neha">Neha</option>
        </select>
        {/* Checkbox for Critical Task */}
        <div
          className={`rounded-3xl text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${inputClass}`}
          onClick={handleCheckboxClick} // Handle click on the entire container
          title="Set as CRITICAL Task"
        >
          <input
            type="checkbox"
            id="critical"
            name="critical"
            checked={isCritical} // Bind checkbox state
            onChange={() => {}} // Prevent default checkbox behavior
            className="mr-1 text-red-500 h-3 w-6 appearance-none border-2 border-gray-300 rounded checked:bg-red-500 checked:border-red-500"
          />
          <label
            htmlFor="critical"
            className="text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent event propagation to avoid double toggle
          >
            ❗
          </label>
        </div>

        <div
          className={`rounded-xl 
            border-2
            
            text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none 
            ${buttonBackgroundColor[theme]}`} // Dynamically apply the button background color based on the theme
          title="Add Task"
        >
          <button
            type="submit" // Ensure this button submits the form
            className="text-sm cursor-pointer"
          >
            AddTask ⬇
          </button>
        </div>
      </form>

      {/* Error Message Below the Form */}
      {error && (
        <div className="flex justify-center w-full mt-2">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

export default NewtaskForm;
