"use strict";
console.log("example");

function example() {
  const reminders = [
    {
      date: new Date(2021, 2, 17),
      label: "Do 309 library!",
      urgency: 3
    },
    {
      date: new Date(2021, 2, 18),
      label: "Do 309 example page!",
      urgency: 2
    },
    {
      date: new Date(2021, 2, 19),
      label: "Do 309 pdf!",
      urgency: 1
    },
    {
      date: new Date(2021, 2, 19),
      label: "Fix sleep!",
      urgency: 2
    }
  ]


  BetaCalendar("#normalCalendar", false, false, "basic");
  BetaCalendar("#minimizableCalendar", false, true, "basic");
  BetaCalendar("#miniAndDragCalendar", true, true, "basic");
  // BetaCalendar("#importedRemindersCalendar", true, true, "basic").importReminders(reminders);
}

example();
