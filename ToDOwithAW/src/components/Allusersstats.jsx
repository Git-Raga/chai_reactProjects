import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import db from '../appwrite/database';
import { Query } from 'appwrite';
import "@fontsource/tinos";
import "@fontsource/lato";
import "@fontsource/ubuntu";

const Alluserstats = () => {
  const [usersStats, setUsersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentFont = localStorage.getItem("selectedFont") || "font-titillium";
  const theme = localStorage.getItem("theme") || "light";

  const userMappings = {
    "neha.adam@salesforce.com": { name: "Neha", initials: "NA" },
    "archita.srivastava@salesforce.com": { name: "Architha", initials: "AS" },
    "rmanjalavadde@salesforce.com": { name: "Raghav M", initials: "RM" },
    "mdusad@salesforce.com": { name: "Muskan", initials: "MD" },
    "mprathaban@salesforce.com": { name: "Mahima", initials: "MP" },
    "suresh.k@salesforce.com": { name: "Suresh", initials: "SK" },
    "bswetha@salesforce.com": { name: "Swetha", initials: "SB" },
    "bhaskarreddy.m@salesforce.com": { name: "Bhaskar", initials: "BH" },
    "dbommineni@salesforce.com": { name: "Dileep", initials: "DI" },
    "marena@salesforce.com": { name: "Marena", initials: "MA" },
    "abhishek.mohanty@salesforce.com": { name: "Abhishek", initials: "AB" },
    "rkrishnamurthy1@salesforce.com": { name: "Raghav K", initials: "RK" },
  };

  useEffect(() => {
    const fetchAllUsersStats = async () => {
      try {
        setLoading(true);
        const response = await db.todocollection.list([
          Query.limit(1000),
          Query.orderDesc("$createdAt"),
        ]);

        const tasksByUser = {};
        
        response.documents.forEach(task => {
          if (!tasksByUser[task.taskowner]) {
            tasksByUser[task.taskowner] = {
              totalTasks: 0,
              completedTasks: 0,
              activeTasks: 0,
              lateTasks: 0,
              perfectTasks: 0
            };
          }

          const userStats = tasksByUser[task.taskowner];
          userStats.totalTasks++;
          
          if (task.completed) {
            userStats.completedTasks++;
            if (task.Perfectstar) {
              userStats.perfectTasks++;
            }
          } else {
            const dueDate = task.duedate ? new Date(task.duedate) : null;
            if (dueDate && dueDate < new Date()) {
              userStats.lateTasks++;
            } else {
              userStats.activeTasks++;
            }
          }
        });

        const formattedStats = Object.entries(tasksByUser).map(([email, stats]) => {
          const user = userMappings[email];
          return {
            email: email,
            name: user?.name || email,
            initials: user?.initials || email.split('@')[0].slice(0, 2).toUpperCase(),
            totalTasks: stats.totalTasks,
            completedTasks: stats.completedTasks,
            activeTasks: stats.activeTasks,
            lateTasks: stats.lateTasks,
            perfectTasks: stats.perfectTasks
          };
        });

        setUsersStats(formattedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsersStats();
  }, []);

  const getFontClass = () => {
    switch (currentFont) {
      case "font-tinos":
        return "font-tinos";
      case "font-lato":
        return "font-lato";
      case "font-ubuntu":
        return "font-ubuntu";
      default:
        return "font-titillium";
    }
  };

  const getContainerClass = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 text-white";
      case "green":
        return "bg-cyan-900 text-white";
      default:
        return "bg-white text-gray-800";
    }
  };

  const getCardClass = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 text-white";
      case "green":
        return "bg-cyan-800 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`min-h-screen ${getContainerClass()} ${getFontClass()} p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Users Statistics</h1>
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : theme === "green"
                ? "bg-cyan-700 hover:bg-cyan-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading statistics...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersStats.map((userStat) => (
              <div
                key={userStat.email}
                className={`${getCardClass()} rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : 
                    theme === "green" ? "bg-cyan-700" : 
                    "bg-gray-200"
                  }`}>
                    <span className="text-lg font-bold">
                      {userStat.initials}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {userStat.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Tasks</span>
                    <span className="font-bold">{userStat.totalTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Tasks</span>
                    <span className="font-bold text-blue-500">{userStat.activeTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed Tasks</span>
                    <span className="font-bold text-green-500">{userStat.completedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Late Tasks</span>
                    <span className="font-bold text-red-500">{userStat.lateTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Perfect Rating (5⭐)</span>
                    <span className="font-bold text-yellow-500">{userStat.perfectTasks}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-opacity-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(userStat.completedTasks / userStat.totalTasks) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-sm mt-2 text-center">
                    {Math.round((userStat.completedTasks / userStat.totalTasks) * 100)}% Completion Rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alluserstats;