"use strict";
console.log('----------')
console.log('Loading BetaCalendar.js')

function BetaCalendar(selector, 
	draggable = "false", 
	minimizable = "false", 
	type = "basic", 
    theme= {
		main: "#99d6ff",
		secondary: "#a6a6a6",
		background: "#E6E6F2",
		cells: "white",
		text: "black"
	}) 
{
	let _self = {};
	_self.selector = selector;
	_self.accessElement = document.querySelector(selector);

	_self.calendar = {
		container: null,
		currentPageDate: new Date(),
		monthLabels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
		currentXpos: null,
		currentYpos: null,
		minimized: false,
		reminders: [
		],
		currentReminder: {
			date: null,
			label: null,
			urgency: 1
		}
	}

	_self.customization = {
		draggable: draggable,
		minimizable: minimizable,
		type: type,
		theme: theme
	}

	/**
	 * Creates calendar container and provides initial styling.
	 *
	 * @function
	 */
	_self.initCalendar = () => {
		const calendarContainer = document.createElement("div");
		_self.calendar.container = calendarContainer;

		_self.calendar.container.id = "betaCalendarContainer" + selector.substring(1);

		_self.calendar.container.style.display = "none"; 

		_self.calendar.currentXpos = "50%";
		_self.calendar.currentYpos = "50%";

		document.body.appendChild(_self.calendar.container);
	}

	/**
	 * Updates the calendar to implement any changes in the _self.calendar object
	 *
	 * @function
	 * @param {Date} calendarDate Date instance specifying the current date of the calendar
	 * @param {boolean} firstCall Boolean indiciting first call of updateCalendar
	 */
	_self.updateCalendar = (calendarDate, firstCall) => {

		// clear the calendar
		if (!firstCall) {
			_self.calendar.container.innerHTML = '';
			_self.calendar.container.removeAttribute("style");
		}

		const calendarTable = document.createElement("table");
		calendarTable.id = "betaCalendarTable";
	
		// Code to create generic calendar with dynamic cells based on current year and month
		if (_self.customization.type == "basic") {
			let day = 1;
			let currentDate = new Date();
			let maxDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth()+1, 0).getDate();
			let gap = new Date(calendarDate.getFullYear() + "-" + (calendarDate.getMonth()+1) + "-01").getDay();
			let firstWeek = true;

			let dateHeaderRow = document.createElement("tr");
			let dateHeaderCell = document.createElement("th");
			dateHeaderCell.id = "betaCalendarDateRow";
			dateHeaderCell.colSpan = "7";
			
			dateHeaderCell.appendChild(document.createTextNode(_self.calendar.monthLabels[calendarDate.getMonth()] + " " + calendarDate.getFullYear()));
			dateHeaderRow.appendChild(dateHeaderCell);
			calendarTable.appendChild(dateHeaderRow);

			let labels = document.createElement("tr");
	
			// weekday label creation
			for (let i = 0; i < 7; i++) {
				let weekdayLabelCell = document.createElement("th");
				weekdayLabelCell.appendChild(document.createTextNode(_self.calendar.weekdayLabels[i]));
				labels.appendChild(weekdayLabelCell);
			}

			calendarTable.appendChild(labels);
			_self.calendar.container.appendChild(calendarTable);

			// day cell creation
			for (let i = 0; i < 6; i++) {
				let row = document.createElement("tr");
	
				for (let j = 0; j < 7; j++) {
						let cell = document.createElement("td");
						let cellDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
						if (firstWeek && j < gap || day > maxDay) {
							cell.appendChild(document.createTextNode(""));
							row.appendChild(cell);
							continue;
						}
						else {
							cell.appendChild(document.createTextNode(day));
							if (cellDate.toDateString() === currentDate.toDateString()) {
								cell.id = "betaCalendarCurrentDay";
							}
							day++;

							if (!_self.calendar.minimized) {

								const todaysReminders = _self.calendar.reminders.filter(reminder => reminder.date.toDateString() === cellDate.toDateString());
	
	
								if (todaysReminders.length != 0) {
									let reminderList = document.createElement("ul");
									reminderList.id = "betaCalendarReminderList";
									todaysReminders.map(reminder => {
										let reminderText = document.createElement("li");
										reminderText.textContent = reminder.label;
										reminderText.id = "betaCalendarReminderUrgency" + reminder.urgency;
	
										let reminderDot = document.createElement("p");
	
										reminderText.appendChild(reminderDot);
										reminderList.appendChild(reminderText);
									})
	
									cell.appendChild(reminderList);
								}
	
							}
	
							row.appendChild(cell);
						}
				}
	
				firstWeek = false;
				calendarTable.appendChild(row);
				if ((day > maxDay)) {
					break;
				}
			}
			
			if (!_self.calendar.minimized) {

			let addReminderDiv = document.createElement("div");
			addReminderDiv.id = "betaCalendarAddReminderContainer";

			let addReminderForm = document.createElement("form");
			addReminderForm.id = "betaCalendarAddReminderForm";
			addReminderForm.method = "post";
			addReminderForm.onsubmit = _self.submitNewReminder;

			let addReminderText = document.createElement("p");
			addReminderText.textContent = "Add a Reminder";
			
			let addReminderDateLabel = document.createElement("label");
			addReminderDateLabel.textContent = "Date: ";
			addReminderDateLabel.for = "betaCalendarAddReminderDateInput"

			let addReminderDateInput = document.createElement("input");
			addReminderDateInput.id = "betaCalendarAddReminderDateInput";
			addReminderDateInput.type = "date";
			addReminderDateInput.name = "enterDate";

			addReminderDateInput.onchange = function () {
				_self.calendar.currentReminder.date = new Date(addReminderDateInput.value);
				_self.calendar.currentReminder.date.setDate(_self.calendar.currentReminder.date.getDate() + 1);
			}

			let addReminderTextLabel = document.createElement("label");
			addReminderTextLabel.textContent = "Reminder Text: ";
			addReminderTextLabel.for = "betaCalendarAddReminderTextInput"

			let addReminderTextInput = document.createElement("input");
			addReminderTextInput.id = "betaCalendarAddReminderTextInput";
			addReminderTextInput.type = "text";
			addReminderTextInput.readonly = "false";
			addReminderTextInput.maxLength = "30";
			
			addReminderTextInput.addEventListener("input", (e) => {
				_self.calendar.currentReminder.label = addReminderTextInput.value;
			})

			let addReminderUrgencyLabel = document.createElement("label");
			addReminderUrgencyLabel.textContent = "Urgency Level: ";
			addReminderUrgencyLabel.for = "betaCalendarAddReminderUrgencyInput"

			let addReminderUrgencyInput = document.createElement("select");
			addReminderUrgencyInput.id = "betaCalendarAddReminderUrgencyInput";

			addReminderUrgencyInput.onchange = function () {
				switch (addReminderUrgencyInput.value) {
					case "Low Priority":
						_self.calendar.currentReminder.urgency = 1;
						break;
					case "Medium Priority":
						_self.calendar.currentReminder.urgency = 2;
						break;
					case "High Priority":
						_self.calendar.currentReminder.urgency = 3;
						break;	
				}
			}

			let LowPrioOption = document.createElement("option");
			LowPrioOption.value = "Low Priority";
			LowPrioOption.textContent = "Low Priority";
			LowPrioOption.id = "betaCalendarLowPrio";

			let MediumPrioOption = document.createElement("option");
			MediumPrioOption.value = "Medium Priority";
			MediumPrioOption.textContent = "Medium Priority";
			MediumPrioOption.id = "betaCalendarMediumPrio";

			let HighPrioOption = document.createElement("option");
			HighPrioOption.value = "High Priority";
			HighPrioOption.textContent = "High Priority";
			HighPrioOption.id = "betaCalendarHighPrio";

			let addReminderSubmitInput = document.createElement("input");
			addReminderSubmitInput.id = "betaCalendarAddReminderSubmitInput";
			addReminderSubmitInput.type = "submit";
			addReminderSubmitInput.value = "Add Reminder";
			
			addReminderDiv.appendChild(addReminderText);
			addReminderForm.appendChild(addReminderDateLabel);
			addReminderForm.appendChild(addReminderDateInput);
			addReminderForm.appendChild(addReminderTextLabel);
			addReminderForm.appendChild(addReminderTextInput);
			addReminderForm.appendChild(addReminderUrgencyLabel);
			addReminderUrgencyInput.appendChild(LowPrioOption);
			addReminderUrgencyInput.appendChild(MediumPrioOption);
			addReminderUrgencyInput.appendChild(HighPrioOption);
			addReminderForm.appendChild(addReminderUrgencyInput);
			addReminderForm.appendChild(addReminderSubmitInput);
			addReminderDiv.appendChild(addReminderForm);
			_self.calendar.container.appendChild(addReminderDiv);

			}

			// calendar interaction buttons
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

			if (_self.customization.minimizable) {
				if (_self.calendar.minimized) {
					let expandButton = document.createElement("button");
					expandButton.id = "betaCalendarExpandButton";
					expandButton.onclick = _self.expand;
					let expandImg = document.createElement("img");
					expandImg.src = "./images/maximize.png";
					expandButton.appendChild(expandImg);

					_self.calendar.container.appendChild(expandButton);
				} else {
					let miniButton = document.createElement("button");
					miniButton.id = "betaCalendarMiniButton";
					miniButton.onclick = _self.minimize;
					let miniImg = document.createElement("img");
					miniImg.src = "./images/minimize.png";
					miniButton.appendChild(miniImg);

					_self.calendar.container.appendChild(miniButton);
				}
			}
			
	
			_self.calendar.container.appendChild(leftButton);
			_self.calendar.container.appendChild(exitButton);
			_self.calendar.container.appendChild(rightButton);

			// applying styles
			if (_self.calendar.minimized){
				for (const element in styling.themes[_self.customization.type].smallCalendar) {
					$("#" + _self.calendar.container.id + " " + element).css(styling.themes[_self.customization.type].smallCalendar[element]);
				}

				if (_self.customization.draggable) {
					_self.makeDraggable(_self.calendar.container);
				}

				// make sure the position of calendar does not change on month change
				_self.calendar.container.style.left = _self.calendar.currentXpos;
				_self.calendar.container.style.top = _self.calendar.currentYpos;
			} else {
				for (const element in styling.themes[_self.customization.type].largeCalendar) {
					$("#" + _self.calendar.container.id + " " + element).css(styling.themes[_self.customization.type].largeCalendar[element]);
				}

				if (_self.customization.draggable) {
					_self.unMakeDraggable(_self.calendar.container);
				}

				_self.calendar.container.style.left = "50%";
				_self.calendar.container.style.top = "50%";
			}

		}
	}

	/**
	* Toggles the calendars display style.
	*
	* @function
	*/
	_self.toggleCalendar = function() {
		if (_self.calendar.container.style.display === "none") {
			_self.calendar.container.style.display = "block";
		} else {
			_self.calendar.container.style.display = "none";
		}
	}

	/**
	* Updates the calendar to the next month.
	*
	* @function
	*/
	_self.nextMonth = function () {
		_self.calendar.currentPageDate.setMonth(_self.calendar.currentPageDate.getMonth()+1);
		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}

	/**
	* Updates the calendar to the last month.
	*
	* @function
	*/
	_self.previousMonth = function () {
		_self.calendar.currentPageDate.setMonth(_self.calendar.currentPageDate.getMonth()-1);
		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}

	/**
	* Updates the calendar to be minimized.
	*
	* @function
	*/
	_self.minimize = function () {
		_self.calendar.minimized = true;
		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}

	/**
	* Updates the calendar to be expanded.
	*
	* @function
	*/
	_self.expand = function () {
		_self.calendar.minimized = false;
		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}

	/**
	* Creates a new reminder in the calendar.
	*
	* @function
	* @returns {boolean} indicating whether the form information was validated
	*/
	_self.submitNewReminder = function () {
		if(_self.calendar.currentReminder.date === null || _self.calendar.currentReminder.label === null) {
			alert("Please fill in all the required information to set a reminder!");

			return false;
		} else {
			const newReminder = {
				date: _self.calendar.currentReminder.date,
				label: _self.calendar.currentReminder.label,
				urgency: _self.calendar.currentReminder.urgency
			}

			_self.calendar.reminders.push(newReminder);
			_self.updateCalendar(_self.calendar.currentPageDate, false);

			_self.calendar.currentReminder.date = null;
			_self.calendar.currentReminder.label = null;
			_self.calendar.currentReminder.urgency = 1;

			return true;
		}
	}

	// draggable element code: https://www.w3schools.com/howto/howto_js_draggable.asp

	/**
	* Makes an element draggable
	*
	* @function
	* @param {element} element the element
	*/
	_self.makeDraggable = function (element) {
		let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		element.onmousedown = startDrag;

		function startDrag(e) {
			e = e || window.event;
			e.preventDefault();

			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = stopDrag;

			document.onmousemove = drag;
		}

		function drag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;

			element.style.top = (element.offsetTop - pos2) + "px";
			element.style.left = (element.offsetLeft - pos1) + "px";
		}

		function stopDrag() {
			document.onmouseup = null;
			document.onmousemove = null;
			_self.calendar.currentXpos = element.style.left;
			_self.calendar.currentYpos = element.style.top;
		}
	}

	/**
	* Makes an element undraggable.
	*
	* @function
	* @param {element} element the element
	*/
	_self.unMakeDraggable = function (element) {
		element.onmousedown = null;
	}

	/**
	* Imports the reminders from the user.
	*
	* @function
	* @param {Object} reminders an array of reminder objects
	*/
	_self.importReminders = function (reminders) {
		_self.calendar.reminders = reminders;
		_self.updateCalendar(_self.calendar.currentPageDate, false);
		_self.calendar.container.style.display = "none";  
	}

	/**
	* Exports the reminders to the user
	*
	* @function
	* @returns {Object} an array of reminder objects
	*/
	_self.exportReminders = function () {
		return _self.calendar.reminders;
	}

	const styling = {
		themes: {
			"basic": {
				smallCalendar: {
					"table": {
						margin: "auto",
						borderCollapse: "collapse"
					},
					"th" : {
						fontWeight: "bold",
						backgroundColor: _self.customization.theme.secondary,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						textAlign: "center",
						minWidth: "40px",
						color: _self.customization.theme.text
					},
					"td" : {
						backgroundColor: _self.customization.theme.cells,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						textAlign: "center",
						minWidth: "40px",
						color: _self.customization.theme.text
					},
					"": {
						fontFamily: "Arial, Helvetica, sans-serif",
						backgroundColor: _self.customization.theme.background,
						padding: "28px 5px 30px 5px",
						position: "absolute",
						width: "400px",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)",
						zIndex: "10000"
					},
					"#betaCalendarDateRow": {
						backgroundColor: _self.customization.theme.main,
					},
					"#betaCalendarCurrentDay": {
						backgroundColor: _self.customization.theme.main,
					},
					"img": {
						width: "100%",
						height: "100%"
					},
					"#betaCalendarLeftButton": {
						position: "absolute",
						left: "0px",
						marginLeft: "16%",
						marginTop: "6px",
						width: "30px",
						height: "20px"
					},
					"#betaCalendarRightButton": {
						position: "absolute",
						right: "0px",
						marginRight: "16%",
						marginTop: "6px",
						width: "30px",
						height: "20px"
					},
					"#betaCalendarExitButton": {
						position: "absolute",
						top: "5px",
						right: "5px",
						width: "30px",
						height: "20px"
					},
					"#betaCalendarExpandButton": {
						position: "absolute",
						top: "5px",
						right: "40px",
						width: "30px",
						height: "20px"
					}
				},
				largeCalendar: {
					"table": {
						margin: "auto",
						width: "100%",
						height: "94%",
						borderCollapse: "collapse"
					},
					"th" : {
						fontWeight: "bold",
						fontSize: "150%",
						backgroundColor: _self.customization.theme.secondary,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						width: "14%",
						height: "12%",
						color: _self.customization.theme.text
					},
					"td" : {
						textAlign: "left",
						verticalAlign: "top",
						fontSize: "120%",
						backgroundColor: _self.customization.theme.cells,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						width: "14%",
						height: "12%",
						color: _self.customization.theme.text
					},
					"": {
						fontFamily: "Arial, Helvetica, sans-serif",
						backgroundColor: _self.customization.theme.background,
						padding: "33px 30px 30px 30px",
						position: "absolute",
						width: "80%",
						height: "88%",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)",
						zIndex: "10000"
					},
					"#betaCalendarDateRow": {
						backgroundColor: _self.customization.theme.main,
					},
					"#betaCalendarCurrentDay": {
						backgroundColor: _self.customization.theme.main
					},
					"img": {
						width: "100%",
						height: "100%"
					},
					"#betaCalendarLeftButton": {
						position: "absolute",
						left: "0px",
						marginLeft: "16%",
						marginTop: "6px",
						width: "40px",
						height: "30px"
					},
					"#betaCalendarRightButton": {
						position: "absolute",
						right: "0px",
						marginRight: "16%",
						marginTop: "6px",
						width: "40px",
						height: "30px"
					},
					"#betaCalendarExitButton": {
						position: "absolute",
						top: "5px",
						right: "5px",
						width: "35px",
						height: "25px"
					},
					"#betaCalendarMiniButton": {
						position: "absolute",
						top: "5px",
						right: "45px",
						width: "35px",
						height: "25px"
					},
					"#betaCalendarReminderList": {
						listStyleType: "none",
						margin: "10px 0px 0px 0px",
						padding: "0px",
						// display: "flex",
						// flexDirection: "row",
					},
					"#betaCalendarReminderList li": {
						fontSize: "80%",
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					},
					"#betaCalendarReminderUrgency1 p": {
						color: "#e60000",
						height: "10px",
						width: "10px",
						backgroundColor: "#008000",
						borderRadius: "50%",
						float: "left",
						order: "-1",
						marginRight: "5px"
					},
					"#betaCalendarReminderUrgency2 p": {
						color: "#ff6600",
						height: "10px",
						width: "10px",
						backgroundColor: "#ff6600",
						borderRadius: "50%",
						float: "left",
						order: "-1",
						marginRight: "5px"
					},
					"#betaCalendarReminderUrgency3 p": {
						color: "#008000",
						height: "10px",
						width: "10px",
						backgroundColor: "#e60000",
						borderRadius: "50%",
						float: "left",
						order: "-1",
						marginRight: "5px"
					},
					"#betaCalendarAddReminderContainer": {
						position: "absolute",
						left: "25%",
						verticalAlign: "top"
					},
					"#betaCalendarAddReminderContainer p": {
						top: "0%",
						color: _self.customization.theme.text
					},
					"#betaCalendarAddReminderForm input, select": {
						marginRight: "10px",
					},
					"#betaCalendarAddReminderForm label": {
						color: _self.customization.theme.text
					},
					"#betaCalendarAddReminderTextInput": {
						zIndex: "100"
					},
					"#betaCalendarHighPrio": {
						color: "#e60000"
					},
					"#betaCalendarMediumPrio": {
						color: "#ff6600"
					},
					"#betaCalendarLowPrio": {
						color: "#008000"
					}
				}
			},
			"fancy": {

			}
		}
	}

	if (_self.accessElement) {
		_self.accessElement.addEventListener("click", _self.toggleCalendar)
	}

	_self.initCalendar();
	_self.updateCalendar(_self.calendar.currentPageDate, true);

	return _self;
}


