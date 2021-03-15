"use strict";
console.log('----------')
console.log('SCRIPT: Creating and loading our JS libraries')

function BetaCalendar(selector, calendarType = "basic") {

	const _self = {}
	_self.selector = selector
	_self.calendarType = calendarType
	_self.accessElement = document.querySelector(selector);
	_self.calendarLabels = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];


	const calendarContainer = document.createElement("div");
	calendarContainer.style.display = "none";

	const calendarTable = document.createElement("table");

	let labels = document.createElement("tr");

	for (let i = 0; i < 7; i++) {
		let day = document.createElement("th");
		day.appendChild(document.createTextNode(_self.calendarLabels[i]));
		labels.appendChild(day);
	}

	calendarTable.appendChild(labels);
	calendarContainer.appendChild(calendarTable);
	
	if (calendarType == "basic") {
		let date = 1;
		for (let i = 0; i < 6; i++) {
			let week = document.createElement("tr");

			for (let j = 0; j < 7; j++) {
				let day = document.createElement("td");
				day.appendChild(document.createTextNode(date));
				week.appendChild(day);
				date++;
			}

			calendarTable.appendChild(week);
		}
	}

	_self.toggleCalendar = function() {
		console.log("clicked!");

		if (calendarContainer.style.display === "none") {
			calendarContainer.style.display = "block";
		} else {
			calendarContainer.style.display = "none";
		}
	}

	if (_self.accessElement) {
		_self.accessElement.addEventListener("click", _self.toggleCalendar)
	}

	document.body.appendChild(calendarContainer);
	return _self
}


