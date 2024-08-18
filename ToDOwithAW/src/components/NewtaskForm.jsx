import React, { useState } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass }) {
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
      className="text-2xl font-bold mb-3 
      rounded-3xl
      font-mono border-gray-400 border-2 border-spacing-3"
      onSubmit={handleAdd}
      id="todo-form"
    >
      <input
        type="text"
        name="newtaskbody"
        placeholder="🤔 Bring it on...What's the next task?"
        maxLength={maxLength}
        className={`w-full p-2 text-lg rounded-3xl mb ${inputClass}`}
      />
      <div className="flex justify-center ">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Centering the error message */}
      </div>
    </form>
  );
}

export default NewtaskForm;
