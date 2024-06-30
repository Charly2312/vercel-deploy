import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import "./EventReminder.css";
import { supabase } from "./supabaseClient";
import { useAuth } from '../context/AuthContext';

function EventReminder() {
  const { user } = useAuth();
  const user_id = user ? user.id : null;
  const [events, setEvents] = useState([]);
  const [weekEvents, setWeekEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("todolist")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });

    const weekEvents = events.filter((event) =>
      isSameWeek(new Date(event.start), start, { weekStartsOn: 0 })
    );

    // Sort weekEvents by date and time
    weekEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

    setWeekEvents(weekEvents);
  }, [events]);

  const currentMonth = new Date();
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className="event-reminder-container">
      <div className="calendar-section">
        <div className="calendar-header">
          <span>Upcoming Events</span>
        </div>
        <table className="calendar-table">
          <thead>
            <tr>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarDays
              .reduce((rows, day, index) => {
                if (index % 7 === 0) rows.push([]);
                rows[rows.length - 1].push(day);
                return rows;
              }, [])
              .map((week, rowIndex) => (
                <tr key={rowIndex}>
                  {week.map((day, colIndex) => (
                    <td
                      key={colIndex}
                      className={`${
                        !isSameMonth(day, currentMonth) ? "disabled" : ""
                      } ${isSameDay(day, new Date()) ? "today" : ""}`}
                    >
                      {format(day, "d")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="event-list">
        {weekEvents && weekEvents.length > 0 ? (
          weekEvents.map((event, index) => (
            <div key={index} className="event-item">
              <span className="event-time">
                {format(new Date(event.start), "d MMM yyyy 'at' HH:mm")}
              </span>
              <span className="event-title">{event.title}</span>
            </div>
          ))
        ) : (
          <span className="no-events">No upcoming events</span>
        )}
      </div>
    </div>
  );
}

export default EventReminder;
