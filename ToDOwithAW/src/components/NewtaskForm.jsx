import React, { useState, useRef } from "react";
import db from "../appwrite/database";

function NewtaskForm({ setNotes, inputClass, theme, selectedFont }) {
  const [error, setError] = useState(null);
  const [isCritical, setIsCritical] = useState(false);
  const maxLength = 255;
  const formRef = useRef(null);
  const [selectedTaskOwner, setSelectedTaskOwner] = useState("TaskOwner?");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const dropdownColors = {
    light: { bg: "bg-gray-100", text: "text-black", hover: "hover:bg-gray-200", selected: "bg-gray-300 text-black" },
    dark: { bg: "bg-gray-700", text: "text-white", hover: "hover:bg-gray-600", selected: "bg-gray-500 text-white" },
    green: { bg: "bg-cyan-700", text: "text-teal-100", hover: "hover:bg-teal-500", selected: "bg-teal-800 text-teal-100" },
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const newTaskText = formData.get("newtaskbody");
    const taskOwner = selectedTaskOwner;

    let tskini = "";
    switch (taskOwner) {
      case "Abhishek": tskini = "AM"; break;
      case "Neha": tskini = "NA"; break;
      case "Mahima": tskini = "MP"; break;
      case "Suresh": tskini = "SK"; break;
      case "Muskan": tskini = "MD"; break;
      case "Swetha": tskini = "SB"; break;
      case "Raghav M": tskini = "RM"; break;
      case "Dileep": tskini = "DB"; break;
      case "Bhaskar": tskini = "BH"; break;
      case "Architha": tskini = "AS"; break;
      default: tskini = "";
    }

    if (newTaskText === "") {
      setError("Task cannot be empty");
      setTimeout(() => setError(null), 1000);
      return;
    }

    if (newTaskText.length > maxLength) {
      setError(`Task cannot exceed ${maxLength} characters`);
      setTimeout(() => setError(null), 2000);
      return;
    }

    if (taskOwner === "TaskOwner?") {
      setError("Task owner not assigned");
      setTimeout(() => setError(null), 2000);
      return;
    }

    try {
      const payload = {
        taskname: newTaskText,
        criticaltask: isCritical,
        taskowner: taskOwner,
        taskownerinitials: tskini,
        completed: false,
      };

      const response = await db.todocollection.create(payload);
      if (response) {
        setNotes((prevState) => {
          const taskAge = calculateTaskAge(response.$createdAt);
          const newTask = { ...response, taskAge };
          const updatedTasks = [...prevState, newTask]; // Add new task to the end
          return sortTasks(updatedTasks);
        });

        formRef.current.reset();
        setIsCritical(false);
        setSelectedTaskOwner("TaskOwner?");
        setError(null);
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 2000);
    }
  };

  // Function to calculate the task age
  const calculateTaskAge = (timestamp) => {
    const startDate = new Date(timestamp);
    const today = new Date();
    let dayCount = 0;

    if (isNaN(startDate)) {
      console.error("Invalid timestamp format:", timestamp);
      return 0;
    }

    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dayCount++;
      }
    }

    return dayCount;
  };

  // Sort tasks: critical tasks first, then by task age (descending), then by creation date (ascending), and completed tasks last
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      // Move completed tasks to the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Critical tasks come first
      if (a.criticaltask && !b.criticaltask) return -1;
      if (!a.criticaltask && b.criticaltask) return 1;

      // Sort by task age in descending order
      if (a.taskAge !== b.taskAge) {
        return b.taskAge - a.taskAge;
      }

      // Sort by creation date in ascending order when task ages are equal
      return new Date(a.$createdAt) - new Date(b.$createdAt);
    });
  };

  const handleCheckboxClick = () => {
    setIsCritical((prev) => !prev);
  };

  const inputFocusClasses = {
    light: "focus:ring-black focus:border-black",
    dark: "focus:ring-gray-400 focus:border-gray-400",
    green: "focus:ring-teal-600 focus:border-teal-600",
  };

  const buttonBackgroundColor = {
    light: "bg-gray-600 hover:bg-gray-900 text-white",
    dark: "bg-white hover:bg-gray-400 text-black",
    green: "bg-teal-700 hover:bg-teal-600 text-teal-100",
  };

  return (
    <div className={`w-full ${selectedFont}`}>
      <form
        ref={formRef}
        className={`font-bold rounded-2xl border-gray-400 border-2 mt-1 mb-3 flex items-center gap-2 ${selectedFont}`}
        onSubmit={handleAdd}
        id="todo-form"
      >
        <input
          type="text"
          name="newtaskbody"
          placeholder="What's the next task? ✍️"
          maxLength={maxLength}
          className={`p-2 mt-1 mb-1 ml-1 text-xl text-center flex-grow rounded-3xl ${inputClass} focus:outline-none focus:ring-2 ${inputFocusClasses[theme]} ${selectedFont}`}
        />

        <div className="relative inline-block w-1/6">
          <div
            className={`p-2 mt-1 mb-1 ml-1 text-center flex-none w-full rounded-2xl cursor-pointer ${dropdownColors[theme].bg} ${dropdownColors[theme].text} ${selectedFont}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {selectedTaskOwner}
          </div>

          {dropdownOpen && (
            <ul className={`absolute z-10 border border-gray-300 mt-1 w-full rounded-lg shadow-lg ${dropdownColors[theme].bg} ${selectedFont}`}>
              {taskOwners.map((owner, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedTaskOwner(owner);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer ${dropdownColors[theme].text} ${dropdownColors[theme].hover} ${selectedFont} ${
                    owner === selectedTaskOwner ? dropdownColors[theme].selected : ""
                  }`}
                >
                  {owner}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={`rounded-3xl text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${inputClass} ${selectedFont}`}
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

        <div
          className={`rounded-xl border-2 text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${buttonBackgroundColor[theme]} ${selectedFont}`}
          title="Add Task"
        >
          <button type="submit" className="text-sm cursor-pointer">
            Add Task ⬇
          </button>
        </div>
      </form>

      {error && (
        <div className="flex justify-center w-full mt-2">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

export default NewtaskForm;
