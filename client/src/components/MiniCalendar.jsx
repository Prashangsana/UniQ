import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MiniCalendar.css';

const MiniCalendar = ({ bookedDates = [] }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
    console.log("Selected date:", newDate); 
  };

  // This function checks if the current calendar tile matches any date in our bookedDates array
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isBooked = bookedDates.some(
        (bookedDate) =>
          bookedDate.getDate() === date.getDate() &&
          bookedDate.getMonth() === date.getMonth() &&
          bookedDate.getFullYear() === date.getFullYear()
      );
      // If there is a match, add the "booked-day" CSS class to that tile
      return isBooked ? 'booked-day' : null;
    }
  };

  return (
    <div className="mini-calendar-wrapper">
      <Calendar 
        onChange={onChange} 
        value={date} 
        className="uniq-calendar"
        next2Label={null} 
        prev2Label={null}
        tileClassName={tileClassName} /* <--- Added the check here */
      />
    </div>
  );
};

export default MiniCalendar;