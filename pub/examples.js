"use strict";
console.log("example");

function example() {
  BetaCalendar("#normalCalendar", false, false, "basic");
  BetaCalendar("#minimizableCalendar", false, true, "basic");
  BetaCalendar("#miniAndDragCalendar", true, true, "basic");
}

example();
