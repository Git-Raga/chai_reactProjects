// File: src/components/NewtaskForm.jsx

import React, { useState, useRef, useEffect } from "react";
import db from "../appwrite/database";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
 

// Function to manage calendar colors based on theme
const getCalendarColors = (theme) => {
  switch (theme) {
    case 'light':
      return {
        bg: 'bg-white',
        text: 'text-black',
        border: 'border-gray-300',
        selectedDateBg: 'bg-blue-500',
        selectedDateText: 'text-white',
        buttonBg: 'bg-gray-700 hover:bg-gray-800 text-white',
      };
    case 'dark':
      return {
        bg: 'bg-gray-800',
        text: 'text-gray-400',
        border: 'border-gray-600',
        selectedDateBg: 'bg-indigo-500',
        selectedDateText: 'text-gray-100',
        buttonBg: 'bg-gray-600 hover:bg-gray-700 text-white',
      };
    case 'green':
      return {
        bg: 'bg-cyan-900',
        text: 'text-teal-500',
        border: 'border-teal-300',
        selectedDateBg: 'bg-teal-500',
        selectedDateText: 'text-teal-100',
        buttonBg: 'bg-teal-700 hover:bg-teal-600 text-teal-100',
      };
    default:
      return {
        bg: 'bg-white',
        text: 'text-black',
        border: 'border-gray-300',
        selectedDateBg: 'bg-blue-500',
        selectedDateText: 'text-white',
        buttonBg: 'bg-gray-700 hover:bg-gray-800 text-white',
      };
  }
};

function NewtaskForm({ addTask, inputClass, theme, selectedFont }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isCritical, setIsCritical] = useState(false);
  const maxLength = 255;
  const formRef = useRef(null);
  const taskOwnerRef = useRef(null);
  const [selectedTaskOwner, setSelectedTaskOwner] = useState("TaskOwner?");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightCalendarIcon, setHighlightCalendarIcon] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get colors based on the current theme
  const calendarColors = getCalendarColors(theme);

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

  const buttonBackgroundColor = {
    light: "bg-gray-600 hover:bg-gray-900 text-white",
    dark: "bg-white hover:bg-gray-400 text-black",
    green: "bg-teal-700 hover:bg-teal-600 text-teal-100",
  };

  const openCalendar = () => setCalendarOpen(true);

  const closeCalendar = () => {
    setCalendarOpen(false);
    if (selectedDate) {
      setHighlightCalendarIcon(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskOwnerRef.current && !taskOwnerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAdd = async (e) => {
    console.log("handleAdd called"); // Debugging
    e.preventDefault();
    console.log("Default form behavior prevented"); // Debugging

    const formData = new FormData(formRef.current);
    const newTaskText = formData.get("newtaskbody").trim(); // Trimmed input
    console.log("New Task Text:", newTaskText); // Debugging

    const taskOwner = selectedTaskOwner;
    console.log("Selected Task Owner:", taskOwner); // Debugging

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

    // Validation
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
        duedate: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        $createdAt: new Date().toISOString(), // Ensure createdAt is set
      };

      console.log("Payload to create:", payload); // Debugging

      const response = await db.todocollection.create(payload);
      console.log("Response from create:", response); // Debugging

      if (response) {
        // Append the new task to the existing notes without sorting
        addTask(response);
        console.log("Task appended to notes"); // Debugging

        // Reset form and provide success feedback
       
        setSuccess("Task added successfully!");
        setTimeout(() => setSuccess(null), 1500);
        formRef.current.reset();
        setIsCritical(false);
        setSelectedTaskOwner("TaskOwner?");
       
        setError(null);
        setSelectedDate(null); // Reset the selected date
        setHighlightCalendarIcon(false); // Remove the red border after task is added
      } else {
        console.error("Failed to add task: No response");
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className={`w-full ${selectedFont}`}>
      <form
        ref={formRef}
        className={`font-bold rounded-2xl border-gray-400 border-2 mt-1 
        mb-3 flex items-center gap-2 ${selectedFont}`}
        onSubmit={handleAdd}
        id="todo-form"
      >
        {/* Task Name Input */}
        <input
          type="text"
          name="newtaskbody"
          placeholder="What's the next task? ✍️"
          maxLength={maxLength}
          className={`p-2 mt-1 mb-1 ml-1 text-xl text-center flex-grow rounded-3xl ${inputClass} focus:outline-none focus:ring-2`}
          tabIndex="1" // Set tabIndex to 1 for task name input
        />

        {/* Calendar Icon with Conditional Border */}
        <FaCalendarAlt
          onClick={openCalendar}
          className={`cursor-pointer text-xl mx-2 ${
            highlightCalendarIcon ? "text-orange-500" : ""
          }`}
          title="Open Calendar"
          tabIndex="2" // Set tabIndex to 2 for calendar icon
        />

        {/* Task Owner Dropdown */}
        <div
          ref={taskOwnerRef}
          className="relative inline-block w-1/6"
          tabIndex="3" // Set tabIndex to 3 for task owner dropdown
          onClick={() => setDropdownOpen((prev) => !prev)}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          <div
            className={`p-2 mt-1 mb-1 ml-1 text-center flex-none w-full rounded-2xl cursor-pointer ${dropdownColors[theme].bg} ${dropdownColors[theme].text} ${selectedFont}`}
          >
            {selectedTaskOwner}
          </div>

          {dropdownOpen && (
            <ul
              className={`absolute z-10 border border-gray-300 mt-1 w-full rounded-lg shadow-lg ${dropdownColors[theme].bg} ${selectedFont}`}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside the dropdown from closing it
              role="listbox"
            >
              {taskOwners.map((owner) => (
                <li
                  key={owner} // Using unique owner name as key
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent div's onClick from toggling the dropdown
                    setSelectedTaskOwner(owner);
                    setDropdownOpen(false); // Close dropdown after selection
                  }}
                  className={`px-4 py-2 cursor-pointer ${dropdownColors[theme].text} ${dropdownColors[theme].hover} ${
                    selectedTaskOwner === owner ? dropdownColors[theme].selected : ""
                  }`}
                  role="option"
                  aria-selected={selectedTaskOwner === owner}
                >
                  {owner}
                </li>
              ))}
            </ul>
          )}
        </div>
             {/* Critical Task Checkbox */}
<div
  className={`rounded-3xl text-center p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${inputClass} ${selectedFont}`}
  title="Set as CRITICAL Task"
  tabIndex="4" // Set tabIndex to 4 for critical task checkbox
  onClick={() => setIsCritical(!isCritical)}
>
  <input
    type="checkbox"
    id="critical"
    name="critical"
    checked={isCritical}
    onChange={() => setIsCritical(!isCritical)}
    className="mr-1 text-red-500 h-3 w-6 appearance-none border-2 border-gray-300 rounded checked:bg-red-500 checked:border-red-500"
  />
  <label htmlFor="critical" className="text-sm cursor-pointer" onClick={(event) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop propagation 
    setIsCritical(!isCritical); 
  }}>⚠️</label>
</div>

        {/* Add Task Button */}
        <div
          className={`rounded-xl border-2 text-center 
            cursor-pointer
            p-2 mt-1 mb-1 ml-1 mr-2 flex-none ${buttonBackgroundColor[theme]} ${selectedFont}`}
          tabIndex="5" // Set tabIndex to 5 for add task button
          title="Add Task"
          onClick={handleAdd} 
        >
          <button type="button" className="text-sm ">
            Add Task ⬇
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center w-full mt-2">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex justify-center w-full mt-2">
          <p className="text-green-500 text-sm text-center">{success}</p>
        </div>
      )}

      {/* Calendar Modal */}
      {calendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-80 w-full ${calendarColors.bg} ${calendarColors.text}`}>
            <h2 className={`text-xl font-bold mb-4 text-center ${calendarColors.text}`}>
              Set the Due Date for this Task
            </h2>

            {/* Centered Calendar Widget */}
            <div className={`p-2 border rounded-lg mb-4 flex justify-center ${calendarColors.border}`}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                className={`w-full ${selectedFont}`}
                calendarClassName={`${calendarColors.bg} ${calendarColors.text}`}
                dayClassName={(date) =>
                  date.toDateString() === selectedDate?.toDateString()
                    ? `${calendarColors.selectedDateBg} ${calendarColors.selectedDateText}`
                    : calendarColors.text
                }
                minDate={new Date()} // Disable all past dates
              />
            </div>

            {/* Selected Date Display */}
            <div className="text-center mt-2">
              {selectedDate ? (
                <p className={`text-lg ${calendarColors.text}`}>
                  Selected Due Date: {selectedDate.toLocaleDateString()}
                </p>
              ) : (
                <p className={`text-lg ${calendarColors.text}`}>No date selected</p>
              )}
            </div>

            {/* Centered Close Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={closeCalendar}
                className={`p-2 rounded-md ${calendarColors.buttonBg}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PropTypes for validation
NewtaskForm.propTypes = {
  addTask: PropTypes.func.isRequired,
  inputClass: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  selectedFont: PropTypes.string.isRequired,
};

export default NewtaskForm;
