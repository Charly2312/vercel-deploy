import React, { useState, useEffect } from "react";
import "./MainContent.css";
import Clock1 from "./Clock1";
import TDL from "./TDL";
import EventReminder from "./EventReminder";
import DailyReminder from "./DailyReminder";
import Header from "./Header";

const MainContent = () => {
  const [tasks, setTasks] = useState({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });

  useEffect(() => {

    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  return (
    <div className="main-content">
      <Header />
      <div className="content-sections">
        <div className="left-section">
          <Clock1 />
        </div>
        <div className="right-section">
          <EventReminder />
          <TDL tasks={tasks} />
        </div>
      </div>
      <div className="bottom-section">
        <DailyReminder />
      </div>
    </div>
  );
};

export default MainContent;