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


  const calendar1 = new BetaCalendar("#normalCalendar", false, false, "basic");
  const calendar2 = new BetaCalendar("#minimizableCalendar", false, true, "basic");
  const calendar3 = new BetaCalendar("#miniAndDragCalendar", true, true, "basic");
  const calendar4 = new BetaCalendar("#importedRemindersCalendar", true, true, "basic");

  const calendar5 = new BetaCalendar("#nightCalendar", true, true, "basic", 
  {
		main: "#006bb3",
    secondary: "#404040",
		background: "#121212",
		cells: "#181818",
		text: "white"
	}
  );

  calendar4.importReminders(reminders);
  console.log(calendar1.exportReminders());
  console.log(calendar2.exportReminders());
  console.log(calendar3.exportReminders());
  console.log(calendar4.exportReminders());
  console.log(calendar5.exportReminders());
}

example();
