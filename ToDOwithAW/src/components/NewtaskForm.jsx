import React, { useState } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass, theme }) {
  const [error, setError] = useState(null);
  const [isCritical, setIsCritical] = useState(false); // State for the checkbox
  const maxLength = 255; // Example max length for the input

  const handleAdd = async (e) => {
    e.preventDefault();
    const newTaskText = e.target.newtaskbody.value;

    if (newTaskText === "") {
      setError("Task cannot be empty");
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
      return;
    }

    if (newTaskText.length > maxLength) {
      setError(`Task cannot exceed ${maxLength} characters`);
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
      return;
    }

    try {
      const payload = { taskname: newTaskText, critical: isCritical }; // Include the critical state in the payload
      const response = await db.todocollection.create(payload);
      setNotes((prevState) => [response, ...prevState]);
      e.target.reset();
      setIsCritical(false); // Reset checkbox state on submission
      setError(null); // Clear error on successful submission
    } catch (error) {
      console.error(error);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
    }
  };

  const handleCheckboxClick = () => {
    setIsCritical((prev) => !prev); // Toggle the critical state
  };

  return (
    <div className="w-full">
      <form
        className="font-bold rounded-3xl font-mono border-gray-400 border-2 mt-1 flex flex-wrap items-center gap-2"
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
          className={`p-2 mt-1 mb-1 ml-1 text-center flex-none w-1/6 rounded-3xl ${inputClass} text-sm`}
        >
          <option value=" ">Select TaskOwner</option>
          <option value="Mahima">Mahima</option>
          <option value="Suresh">Suresh</option>
          <option value="Abhishek">Abhishek</option>
          <option value="Muskan">Muskan</option>
          <option value="Swetha">Swetha</option>
          <option value="RaghavM">RaghavM</option>
          <option value="Dileep">Dileep</option>
          <option value="Bhaskar">Bhaskar</option>
          <option value="Architha">Architha</option>
          <option value="Neha">Neha</option>
        </select>
        {/* Checkbox for Critical Task */}
        <div
          className={`rounded-3xl text-center p-2 mt-1 mb-1 ml-1
            mr-2 flex-none ${inputClass}`}
          onClick={handleCheckboxClick} // Handle click on the entire container
        >
          <input
            type="checkbox"
            id="critical"
            name="critical"
            checked={isCritical} // Bind checkbox state
            onChange={() => {}} // Prevent default checkbox behavior
            className="mr-1
            text-sm"
          />
          <label
            htmlFor="critical"
            className="text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent event propagation to avoid double toggle
          >
            Critical?
          </label>
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
