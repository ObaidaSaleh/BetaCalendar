"use strict";
console.log('----------')
console.log('Loading BetaCalendar.js')

function BetaCalendar(selector, calendarType = "basic") {
	const _self = {}
	_self.selector = selector
	_self.calendarType = calendarType
	_self.accessElement = document.querySelector(selector);
	_self.calendarWeekdayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
	_self.calendarMonthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	_self.calendarContainer;
	_self.calendarTable;

	_self.initCalendar = () => {
		const calendarContainer = document.createElement("div");
		_self.calendarContainer = calendarContainer;

		calendarContainer.id = "betaCalendarContainer";
		calendarContainer.style.display = "block"; // TEMP BLOCK, none ON RELEASE
	
		const calendarTable = document.createElement("table");
		_self.calendarTable = calendarTable;
		calendarTable.id = "betaCalendarTable";
	
		// Code to create generic calendar with dynamic cells based on current year and month
		if (calendarType == "basic") {
			let day = 1;
			let date = new Date();
			let maxDay = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
			let gap = new Date(date.getFullYear() + "-" + (date.getMonth()+1) + "-01").getDay();
			let firstWeek = true;
			gap = (gap===0) ? 7 : gap; 

			let dateHeaderRow = document.createElement("tr");
			let dateHeaderCell = document.createElement("th");
			dateHeaderCell.id = "betaCalendarDateRow";
			dateHeaderCell.colSpan = "7";
			
			dateHeaderCell.appendChild(document.createTextNode(_self.calendarMonthLabels[date.getMonth()] + " " + date.getFullYear()));
			dateHeaderRow.appendChild(dateHeaderCell);
			calendarTable.appendChild(dateHeaderRow);

			let labels = document.createElement("tr");
	
			for (let i = 0; i < 7; i++) {
				let day = document.createElement("th");
				day.appendChild(document.createTextNode(_self.calendarWeekdayLabels[i]));
				labels.appendChild(day);
			}

			calendarTable.appendChild(labels);
			calendarContainer.appendChild(calendarTable);

			for (let i = 0; i < 6; i++) {
				let row = document.createElement("tr");
	
				for (let j = 0; j < 7; j++) {
					if (day <= maxDay) {
						let cell = document.createElement("td");
						if (firstWeek && j+1 < gap) {
							cell.appendChild(document.createTextNode(""));
						}
						else {
							cell.appendChild(document.createTextNode(day));
							if (day === date.getDate()) {
								cell.id = "betaCalendarCurrentDay";
							}
							day++;
						}
	
						row.appendChild(cell);
					}
				}
	
				firstWeek = false;
				calendarTable.appendChild(row);
			}
		}

		document.body.appendChild(calendarContainer);
	}

	_self.toggleCalendar = function() {
		console.log("clicked!");

		if (_self.calendarContainer.style.display === "none") {
			_self.calendarContainer.style.display = "block";
		} else {
			_self.calendarContainer.style.display = "none";
		}
	}


	const styling = {
		themes: {
			"basic": {
				calendar: {
					"table": {
						margin: "auto"
					},
					"td, th" : {
						border: "1px solid black",
						padding: "5px",
						textAlign: "center",
						backgroundColor: "#FFFFFF"
					},
					"th" : {
						fontWeight: "bold",
						backgroundColor: "#a6a6a6"
					},
					"": {
						backgroundColor: "#E6E6F2",
						padding: "20px",
						position: "absolute",
						margin: "auto",
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
						width: "350px",
						height: "250px",
						boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)"
					},
					"#betaCalendarDateRow": {
						backgroundColor: "#99d6ff",
					},
					"#betaCalendarCurrentDay": {
						backgroundColor: "#99d6ff"
					}
				}
			},
			"fancy": {

			}
		}
	}

	_self.initCalendar();

	for (const element in styling.themes[_self.calendarType].calendar) {
		$("#betaCalendarContainer " + element).css(styling.themes[_self.calendarType].calendar[element]);
	}

	if (_self.accessElement) {
		_self.accessElement.addEventListener("click", _self.toggleCalendar)
	}

	return _self
}


