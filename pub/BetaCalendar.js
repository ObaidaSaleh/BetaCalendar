"use strict";
console.log('----------')
console.log('Loading BetaCalendar.js')

function BetaCalendar(selector, calendarType = "basic") {
	const _self = {};
	_self.selector = selector;
	_self.calendarType = calendarType;
	_self.accessElement = document.querySelector(selector);
	_self.calendarWeekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	_self.calendarMonthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	_self.calendarContainer;
	_self.calendarDate = new Date();

	_self.initCalendar = () => {
		const calendarContainer = document.createElement("div");
		_self.calendarContainer = calendarContainer;

		calendarContainer.id = "betaCalendarContainer";
		calendarContainer.style.display = "block"; // TEMP BLOCK, none ON RELEASE

		document.body.appendChild(calendarContainer);
	}

	_self.updateCalendar = (calendarDate) => {

		// clear the calendar
		_self.calendarContainer.innerHTML = '';

		const calendarTable = document.createElement("table");
		calendarTable.id = "betaCalendarTable";
	
		// Code to create generic calendar with dynamic cells based on current year and month
		if (_self.calendarType == "basic") {
			let day = 1;
			let currentDate = new Date();
			let maxDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0).getDate();
			let gap = new Date(calendarDate.getFullYear() + "-" + (calendarDate.getMonth()+1) + "-01").getDay();
			let firstWeek = true;
			// gap = (gap===0) ? 7 : gap; 

			let dateHeaderRow = document.createElement("tr");
			let dateHeaderCell = document.createElement("th");
			dateHeaderCell.id = "betaCalendarDateRow";
			dateHeaderCell.colSpan = "7";
			
			dateHeaderCell.appendChild(document.createTextNode(_self.calendarMonthLabels[calendarDate.getMonth()] + " " + calendarDate.getFullYear()));
			dateHeaderRow.appendChild(dateHeaderCell);
			calendarTable.appendChild(dateHeaderRow);

			let labels = document.createElement("tr");
	
			for (let i = 0; i < 7; i++) {
				let day = document.createElement("th");
				day.appendChild(document.createTextNode(_self.calendarWeekdayLabels[i]));
				labels.appendChild(day);
			}

			calendarTable.appendChild(labels);
			_self.calendarContainer.appendChild(calendarTable);

			for (let i = 0; i < 6; i++) {
				let row = document.createElement("tr");
	
				for (let j = 0; j < 7; j++) {
						let cell = document.createElement("td");
						if (firstWeek && j < gap || day > maxDay) {
							cell.appendChild(document.createTextNode(""));
						}
						else {
							cell.appendChild(document.createTextNode(day));
							if (day === currentDate.getDate() 
							&& calendarDate.getMonth() === currentDate.getMonth() 
							&& calendarDate.getFullYear() === currentDate.getFullYear()) {
								cell.id = "betaCalendarCurrentDay";
							}
							day++;
						}
						row.appendChild(cell);
				}
	
				firstWeek = false;
				calendarTable.appendChild(row);
				if ((day > maxDay)) {
					break;
				}
			}

			let leftButton = document.createElement("button");
			leftButton.id = "betaCalendarLeftButton";
			leftButton.onclick = _self.previousMonth;
			let leftImg = document.createElement("img");
			leftImg.src = "./images/chevron-left.png";
			leftButton.appendChild(leftImg);
	
			let rightButton = document.createElement("button");
			rightButton.id = "betaCalendarRightButton";
			rightButton.onclick = _self.nextMonth;
			let rightImg = document.createElement("img");
			rightImg.src = "./images/chevron-right.png";
			rightButton.appendChild(rightImg);

			let exitButton = document.createElement("button");
			exitButton.id = "betaCalendarExitButton";
			exitButton.onclick = _self.toggleCalendar;
			let exitImg = document.createElement("img");
			exitImg.src = "./images/exit.png";
			exitButton.appendChild(exitImg);
	
			_self.calendarContainer.appendChild(leftButton);
			_self.calendarContainer.appendChild(rightButton);
			_self.calendarContainer.appendChild(exitButton);

			for (const element in styling.themes[_self.calendarType].calendar) {
				$("#betaCalendarContainer " + element).css(styling.themes[_self.calendarType].calendar[element]);
			}
		}
	}


	_self.toggleCalendar = function() {
		console.log("clicked!");

		if (_self.calendarContainer.style.display === "none") {
			_self.calendarContainer.style.display = "block";
		} else {
			_self.calendarContainer.style.display = "none";
		}
	}

	_self.nextMonth = function () {
		_self.calendarDate.setMonth(_self.calendarDate.getMonth()+1);
		_self.updateCalendar(_self.calendarDate);
	}

	_self.previousMonth = function () {
		_self.calendarDate.setMonth(_self.calendarDate.getMonth()-1);
		_self.updateCalendar(_self.calendarDate);
	}

	function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		if(elmnt.style.right != null && elmnt.style.right != "auto"){
			//calculate right offset
			var offsetright = window.innerWidth-elmnt.offsetLeft-elmnt.offsetWidth;
			//add the offset to the right of the element
			elmnt.style.right = (offsetright +pos1) + "px";
		}

		// if(elmnt.style.bottom != null && elmnt.style.bottom != "auto"){
		// 	//calculate bottom offset
		// 	var offsetbottom = window.innerHeight-elmnt.offsetTop-elmnt.offsetHeight;
		// 	//add the offset to the right of the element
		// 	elmnt.style.bottom = (offsetbottom +pos2) + "px";
		// }

		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
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
						backgroundColor: "#FFFFFF",
						minWidth: "40px"
					},
					"th" : {
						fontWeight: "bold",
						backgroundColor: "#a6a6a6"
					},
					"": {
						backgroundColor: "#E6E6F2",
						padding: "20px",
						position: "absolute",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						width: "400px",
						height: "280px",
						boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)"
					},
					"#betaCalendarDateRow": {
						backgroundColor: "#99d6ff",
					},
					"#betaCalendarCurrentDay": {
						backgroundColor: "#99d6ff"
					},
					"img": {
						width: "20px",
						height: "20px"
					},
					"#betaCalendarLeftButton": {
						position: "absolute",
						left: "100px",
						bottom: "10px"
					},
					"#betaCalendarRightButton": {
						position: "absolute",
						right: "100px",
						bottom: "10px"
					},
					"#betaCalendarExitButton": {
						position: "absolute",
						right: "202px",
						bottom: "10px"
					}
				}
			},
			"fancy": {

			}
		}
	}

	_self.initCalendar();
	_self.updateCalendar(_self.calendarDate);
	dragElement(_self.calendarContainer);

	if (_self.accessElement) {
		_self.accessElement.addEventListener("click", _self.toggleCalendar)
	}

	return _self
}


