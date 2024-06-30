import React, { useState, useEffect } from "react";
import "./Timetable.css";
import Sidebar from "../../components/Sidebar";
import DailyReminder from "../../components/DailyReminder";
import { Link } from "react-router-dom";
import linkIcon from "../../assets/link-icon.png";

function Timetable() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from localStorage (calendar and to-do list)
    const calendarEvents =
      JSON.parse(localStorage.getItem("calendarEvents")) || [];
    const todoEvents = JSON.parse(localStorage.getItem("todoEvents")) || [];
    setEvents([...calendarEvents, ...todoEvents]);
  }, []);

  const renderEvents = (day, time) => {
    return events
      .filter((event) => event.day === day && event.time === time)
      .map((event, index) => (
        <div key={index} className={`event ${event.color}`}>
          {event.title}
        </div>
      ));
  };

  const times = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}00`
  );

  return (
    <div className="timetable-container">
      <Sidebar />
      <div className="timetable-main">
        <header>
          <h1>Timetable</h1>
          <div className="link-buttons">
            <button>
              <img src={linkIcon} alt="Link" className="link-icon" />
              Import link here
            </button>
          </div>
        </header>
        <div className="timetable-wrapper">
          <div className="timetable">
            <div className="time-column">
              {times.map((time) => (
                <div key={time} className="time">
                  {time}
                </div>
              ))}
            </div>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <div key={day} className="daily-column">
                <div className="daily-header">{day}</div>
                {times.map((time) => (
                  <div key={time} className="time-slot">
                    {renderEvents(day, time)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <footer>
          <DailyReminder />
        </footer>
      </div>
    </div>
  );
}

export default Timetable;
