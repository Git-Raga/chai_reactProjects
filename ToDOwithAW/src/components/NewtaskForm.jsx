import React, { useState } from "react";

function NewtaskForm({ setNotes }) {
  const [error, setError] = useState(null);
  const maxLength = 255; // Example max length for the input

  const handleAdd = async (e) => {
    e.preventDefault();
    const newTaskText = e.target.newtaskbody.value;

    if (newTaskText === '') {
      setError('Task cannot be empty');
      return;
    }

    if (newTaskText.length > maxLength) {
      setError(`Task cannot exceed ${maxLength} characters`); // Corrected here
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
        className="w-full p-2 text-lg
        rounded-3xl mb"
      />
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default NewtaskForm;
