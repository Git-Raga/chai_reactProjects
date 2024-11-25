import React from "react";

function TaskHeader({ theme }) {
  const themeTextColor =
    theme === "dark" || theme === "green" ? "text-white" : "text-gray-800";
  const headerBackground =
    theme === "dark"
      ? "bg-gray-900"
      : theme === "green"
      ? "bg-cyan-900"
      : "bg-white";
  const borderColor =
    theme === "dark" ? "border-gray-600" : "border-gray-300";
  const dueDateBackground =
    theme === "dark"
      ? "bg-gray-800 text-orange-400"
      : theme === "green"
      ? "bg-teal-100 text-orange-600"
      : "bg-orange-600 text-white";

  return (
    <div
      className={`w-full whitespace-nowrap ${headerBackground} border-b ${borderColor} `}
    >
      <div className={`flex items-center text-sm font-semibold ${themeTextColor}`}>
        {/* Urgency */}
        <span className="flex-none w-[100px] text-left ml-3 flex items-center">
          URGENCY
        </span>

        {/* Task Details */}
        <span className="flex-grow text-left ml-1 flex items-center w-[150px]">
          TASK DETAILS
        </span>

        {/* Due Date */}
        <span className={`flex-none w-[70px] text-center flex items-center justify-center h-6 rounded-md mr-[15px] ${dueDateBackground}`}>
          Due
        </span>

        {/* Perfect */}
        <span className="flex-none w-[100px] text-center mr-[-35px] flex items-center justify-center ">
          PERFECT ⭐
        </span>

        {/* Task Owner */}
        <span className="flex-none w-[200px] text-center flex items-center justify-center mr-[-45px]">
          TASK OWNER
        </span>

        {/* Task Age */}
        <span className="flex-none w-[100px] text-right flex items-center justify-end mr-[142px]">
          TASK AGE
        </span>
      </div>
    </div>
  );
}

export default TaskHeader;
