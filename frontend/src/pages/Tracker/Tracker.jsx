import React, { useEffect, useState } from "react";
import {
  startOfDay,
  startOfWeek,
  getWeek,
  getMonth,
  getYear,
  format,
  eachWeekOfInterval,
  isSameWeek,
  parseISO,
} from "date-fns";
import "./Tracker.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Sidebar from "../../components/Sidebar";
import DailyReminder from "../../components/DailyReminder";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Tracker() {
  const [taskData, setTaskData] = useState({
    completedTasks: 0,
    incompleteTasks: 0,
    totalTasks: 0,
    filteredData: [],
    completedTaskNames: [],
    incompleteTaskNames: [],
  });
  const [filter, setFilter] = useState("weekly"); // Default filter set to weekly
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedWeek, setSelectedWeek] = useState(getWeek(new Date()));

  useEffect(() => {
    fetchAndSetTaskData();
  }, [filter, selectedMonth, selectedWeek]);

  const fetchAndSetTaskData = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const completedTasks = Object.values(tasks)
      .flat()
      .filter((task) => task.completed).length;
    const incompleteTasks = Object.values(tasks)
      .flat()
      .filter((task) => !task.completed).length;
    const totalTasks = Object.values(tasks).flat().length;
    const completedTaskNames = Object.values(tasks)
      .flat()
      .filter((task) => task.completed)
      .map((task) => task.title);
    const incompleteTaskNames = Object.values(tasks)
      .flat()
      .filter((task) => !task.completed)
      .map((task) => task.title);

    let filteredData;
    if (filter === "daily") {
      filteredData = getDailyData(tasks);
    } else if (filter === "weekly") {
      filteredData = getWeeklyData(tasks);
    } else if (filter === "monthly") {
      filteredData = getMonthlyData(tasks);
    }

    setTaskData({
      completedTasks,
      incompleteTasks,
      totalTasks,
      filteredData,
      completedTaskNames,
      incompleteTaskNames,
    });
  };

  const getDailyData = (tasks) => {
    const dailyData = new Array(7).fill(0);
    const startOfSelectedWeek = startOfWeek(
      new Date(getYear(new Date()), selectedMonth, 1 + (selectedWeek - 1) * 7)
    );

    Object.values(tasks)
      .flat()
      .forEach((task) => {
        if (task.completed) {
          const taskDate = parseISO(task.start);
          if (
            getMonth(taskDate) === selectedMonth &&
            isSameWeek(taskDate, startOfSelectedWeek)
          ) {
            const dayOfWeek = taskDate.getDay();
            dailyData[dayOfWeek]++;
          }
        }
      });

    console.log(
      `Daily data for week ${selectedWeek}, month ${selectedMonth}:`,
      dailyData
    );
    return dailyData;
  };

  const getWeeklyData = (tasks) => {
    const weeklyData = new Array(5).fill(0); // Assuming up to 5 weeks in a month
    Object.values(tasks)
      .flat()
      .forEach((task) => {
        if (task.completed) {
          const taskDate = parseISO(task.start);
          if (getMonth(taskDate) === selectedMonth) {
            const weekOfMonth = getWeekOfMonth(taskDate);
            weeklyData[weekOfMonth - 1]++;
          }
        }
      });

    console.log(`Weekly data for month ${selectedMonth}:`, weeklyData);
    return weeklyData;
  };

  const getMonthlyData = (tasks) => {
    const monthlyData = new Array(12).fill(0);
    Object.values(tasks)
      .flat()
      .forEach((task) => {
        if (task.completed) {
          const month = parseISO(task.start).getMonth();
          monthlyData[month]++;
        }
      });

    console.log("Monthly data:", monthlyData);
    return monthlyData;
  };

  const getWeekOfMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const adjustedDate = date.getDate() + startOfMonth.getDay();
    return Math.ceil(adjustedDate / 7);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(parseInt(e.target.value));
  };

  const pieData = {
    labels: ["Completed Tasks", "Incomplete Tasks"],
    datasets: [
      {
        data: [taskData.completedTasks, taskData.incompleteTasks],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const barData = {
    labels:
      filter === "daily"
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : filter === "weekly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
    datasets: [
      {
        label: "Tasks Completed",
        data: taskData.filteredData,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            label += context.raw;
            if (context.label === "Completed Tasks") {
              label += ` (${taskData.completedTaskNames.join(", ")})`;
            } else if (context.label === "Incomplete Tasks") {
              label += ` (${taskData.incompleteTaskNames.join(", ")})`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="tracker-container">
      <Sidebar />
      <div className="tracker-main">
        <header className="tracker-header">
          <h1>Tracker</h1>
          <div className="link-buttons">
            <button>Link to Canvas</button>
            <button>Import link here</button>
          </div>
        </header>
        <div className="tracker-content">
          <div className="chart-section">
            <div className="chart-container">
              <Pie data={pieData} options={options} />
            </div>
            <div className="stats-container">
              <h2>Total Hours Spent</h2>
              <p>{taskData.totalTasks * 2}</p>{" "}
              {/* Example: Assuming each task takes 2 hours */}
            </div>
          </div>
          <div className="filter-container">
            <label htmlFor="filter">Filter: </label>
            <select id="filter" value={filter} onChange={handleFilterChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {(filter === "daily" || filter === "weekly") && (
              <>
                <label htmlFor="month">Month: </label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(getYear(new Date()), i, 1), "MMMM")}
                    </option>
                  ))}
                </select>
                {filter === "daily" && (
                  <>
                    <label htmlFor="week">Week: </label>
                    <select
                      id="week"
                      value={selectedWeek}
                      onChange={handleWeekChange}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Week {i + 1}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}
          </div>
          <div className="bar-chart-container">
            <Bar data={barData} />
          </div>
        </div>
        <footer>
          <DailyReminder />
        </footer>
      </div>
    </div>
  );
}

export default Tracker;
