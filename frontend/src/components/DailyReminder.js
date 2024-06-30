// DailyReminder.js
import { useCallback, useState, useEffect } from "react";
import "./DailyReminder.css";

export default function DailyReminder() {
  const [quote, setQuote] = useState("Loading...");

  const fetchQuote = useCallback(() => {
    const url = "https://type.fit/api/quotes";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Since this API returns an array of quotes, randomly select one
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        if (randomQuote.text && randomQuote.author) {
          setQuote(`${randomQuote.text} - ${randomQuote.author}`);
        } else {
          throw new Error("No quote data available");
        }
      })
      .catch(() => setQuote("Failed to load the quote!"));
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="daily-reminder-box">
      <h2>Daily Reminder</h2>
      <p>{quote}</p>
    </div>
  );
}
