import React, { useState } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass, theme }) {
  const [error, setError] = useState(null);
  const maxLength = 255; // Example max length for the input

  const handleAdd = async (e) => {
    e.preventDefault();
    const newTaskText = e.target.newtaskbody.value;

    if (newTaskText === '') {
      setError('Task cannot be empty');
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
      return;
    }

    if (newTaskText.length > maxLength) {
      setError(`Task cannot exceed ${maxLength} characters`);
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
      return;
    }

    try {
      const payload = { taskname: newTaskText };
      const response = await db.todocollection.create(payload);
      setNotes((prevState) => [response, ...prevState]);
      e.target.reset();
      setError(null); // Clear error on successful submission
    } catch (error) {
      console.error(error);
      setError('Failed to add task. Please try again.');
      setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
    }
  };

  return (
    <form
      className="text-2xl font-bold  rounded-3xl font-mono border-gray-400 border-2 items-center 
      mt-2
      
      space-x-3" // Flexbox for layout with space between input and dropdown
      onSubmit={handleAdd}
      id="todo-form"
    >
      {/* Adjusted input styling */}
      <input
        type="text"
        name="newtaskbody"
        placeholder="🤔 Bring it on...What's the next task?"
        maxLength={maxLength}
        className={`w-4/6 p-1 
          mt-2
          ml-2
          text-xl text-center rounded-3xl   mr-8 ${inputClass}`}  // Set input field to grow and take maximum width
      />
      {/* Updated Dropdown for Owners */}
      <select
        className={` p-2 rounded-3xl ${inputClass} text-sm`} // Dropdown on the right, does not grow
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
      <div className="flex justify-center w-full mt-2">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Centering the error message */}
      </div>
    </form>
  );
}

export default NewtaskForm;
