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


  const calendar1 = BetaCalendar("#normalCalendar", false, false, "basic");
  const calendar2 = BetaCalendar("#minimizableCalendar", false, true, "basic");
  const calendar3 = BetaCalendar("#miniAndDragCalendar", true, true, "basic");
  const calendar4 = BetaCalendar("#importedRemindersCalendar", true, true, "basic");

  calendar4.importReminders(reminders);

  // console.log(calendar4.exportReminders());
}

example();
