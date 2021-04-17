"use strict";
console.log('----------');
console.log('Loading BetaCalendar.js');

(function(global, document) { 

	function BetaCalendar(selector, 
		draggable = false, 
		minimizable = false, 
		type = "basic", 
		todoListEnabled = false,
		theme= {
			main: "#99d6ff",
			secondary: "#a6a6a6",
			background: "#E6E6F2",
			cells: "white",
			text: "black"
		}) 
	{

		return privateCalendarInit(selector, 
			draggable,
			minimizable,
			type,
			todoListEnabled,
			theme);
	}

	function privateCalendarInit(selector, 
		draggable = false, 
		minimizable = false, 
		type = "basic", 
		todoListEnabled = true,
		theme= {
			main: "#99d6ff",
			secondary: "#a6a6a6",
			background: "#E6E6F2",
			cells: "white",
			text: "black"
		}) 
	{

	let self = {};
	let _self = {};
	_self.selector = selector;
	_self.accessElement = document.querySelector(selector);
	_self.currentDisplay = "calendar";

	_self.calendar = {
		container: null,
		currentPageDate: new Date(),
		monthLabels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
		currentXpos: null,
		currentYpos: null,
		minimized: false,
		pinned: (draggable === "true" ? false : true),
		reminders: [
		],
		currentReminder: {
			date: null,
			label: null,
			urgency: 1
		}
	}

	_self.todoList = {
		groupedReminders: {}
	}

	_self.customization = {
		draggable: draggable,
		minimizable: minimizable,
		type: type,
		todoListEnabled: todoListEnabled,
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
		
		// retrieve reminders from localStorage
		_self.calendar.reminders = JSON.parse(localStorage.getItem("reminders-"+selector.substring(1)));

		if(_self.calendar.reminders === null) {
			_self.calendar.reminders = [];
		}

		_self.calendar.reminders.forEach(reminder => reminder.date = new Date(reminder.date));

		// localStorage.clear()

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
	
		// Code to create generic calendar with dynamic cells based on current year and month
		if (_self.currentDisplay === "calendar") {
			if (_self.customization.type == "basic") {
				const calendarTable = document.createElement("table");
				calendarTable.id = "betaCalendarTable";
				
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


									// console.log(_self.calendar.reminders);

									const todaysReminders = (_self.calendar.reminders !== null ? 
										_self.calendar.reminders.filter(reminder => reminder.date.toDateString() === cellDate.toDateString()) : []);
										
		
									if (todaysReminders.length != 0) {
										if(_self.calendar.minimized) {
											todaysReminders.map(reminder => {
												if (cellDate.toDateString() === currentDate.toDateString()) {
													cell.id = "betaCalendarCurrentDayUrgency" + reminder.urgency;
												} else {
													cell.id = "betaCalendarReminderUrgency" + reminder.urgency
												}
											})
										} else {
											let reminderList = document.createElement("ul");
											reminderList.id = "betaCalendarReminderList";
											todaysReminders.map(reminder => {
												let reminderText = document.createElement("li");
												reminderText.textContent = reminder.label;
												reminderText.id = "betaCalendarReminderUrgency" + reminder.urgency;
			
												let reminderDot = document.createElement("p");
			
												reminderText.appendChild(reminderDot);
												reminderList.appendChild(reminderText);
												
												let trashImg = document.createElement("img");
												trashImg.id = "betaCalendarTrashButton";
												trashImg.src = "./images/trash.png";

												reminderText.appendChild(trashImg);

												trashImg.addEventListener("click", function(){
													_self.deleteReminder(reminder);
												}, false);
												
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
				addReminderText.textContent = "Add a Reminder:";
				
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

						let pinButton = document.createElement("button");
						pinButton.id = "betaCalendarPinButton";
						pinButton.onclick = (() => _self.togglePin(_self.calendar.container));
						let pinImg = document.createElement("img");
						pinImg.src = "./images/pin.png";
						pinButton.appendChild(pinImg);

						_self.calendar.container.appendChild(pinButton);
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

				if (!_self.calendar.minimized && _self.customization.todoListEnabled) {
					let todoListButton = document.createElement("button");
					todoListButton.id = "betaCalendarTodoListButton";
					todoListButton.onclick = _self.todoListToggle;
					let todoListImg = document.createElement("img");
					todoListImg.src = "./images/todo-list.png";
					todoListButton.appendChild(todoListImg);

					_self.calendar.container.appendChild(todoListButton);
				}
		
				_self.calendar.container.appendChild(leftButton);
				_self.calendar.container.appendChild(exitButton);
				_self.calendar.container.appendChild(rightButton);

				// applying styles
				if (_self.calendar.minimized){
					for (const element in styling.themes[_self.customization.type].smallCalendar) {
						$("#" + _self.calendar.container.id + " " + element).css(styling.themes[_self.customization.type].smallCalendar[element]);
					}

					if (_self.customization.draggable || !_self.calendar.pinned) {
						_self.makeDraggable(_self.calendar.container);
						_self.customization.draggable = false;
					}

					// make sure the position of calendar does not change on month change
					_self.calendar.container.style.left = _self.calendar.currentXpos;
					_self.calendar.container.style.top = _self.calendar.currentYpos;
				} else {
					for (const element in styling.themes[_self.customization.type].largeCalendar) {
						$("#" + _self.calendar.container.id + " " + element).css(styling.themes[_self.customization.type].largeCalendar[element]);
					}

					_self.unMakeDraggable(_self.calendar.container);

					_self.calendar.container.style.left = "50%";
					_self.calendar.container.style.top = "50%";
				}
			}// end of basic calendar
		} else if (_self.currentDisplay === "todoList") {
			const todoListHeader = document.createElement("header");
			todoListHeader.id = "betaTodoListHeader";

			const todoListTitle = document.createElement("h1");
			todoListTitle.id = "betaTodoListTitle";

			const todoListTitleText = document.createTextNode("Reminder List");

			const todoListRemindersContainer = document.createElement("div");
			todoListRemindersContainer.id = "betaTodoListContainer";

			todoListTitle.appendChild(todoListTitleText);
			todoListHeader.appendChild(todoListTitle);
			_self.calendar.container.appendChild(todoListHeader);
			_self.calendar.container.appendChild(todoListRemindersContainer);

			_self.calendar.reminders.sort((b, a) => b.date - a.date)

			// create grouped reminders
			_self.calendar.reminders.forEach(reminder => {
				if (reminder.date.toDateString() in _self.todoList.groupedReminders) {
					_self.todoList.groupedReminders[reminder.date.toDateString()].push([reminder.label, reminder.urgency])
				} else {
					_self.todoList.groupedReminders[reminder.date.toDateString()] = [[reminder.label, reminder.urgency]];
				}
			})

			Object.keys(_self.todoList.groupedReminders).map(function(key, index) {
				const todoListDateGroup = document.createElement("div");
				todoListDateGroup.id = "betaTodoDateGroup";

				const todoListDateHeader = document.createElement("h2");
				todoListDateHeader.className = "betaTodoListDateHeader";

				const todoListDateHeaderText = document.createTextNode(key);
				todoListDateHeader.appendChild(todoListDateHeaderText);

				const todoListGroupedReminderList = document.createElement("ul");
				todoListGroupedReminderList.className = "betaTodoListRemindersList";

				_self.todoList.groupedReminders[key].map(reminder => {
					const todoListGroupedReminderListItem = document.createElement("li");
					todoListGroupedReminderListItem.className = "betaTodoListRemindersListItem";

					const todoListGroupedReminderListItemText = document.createTextNode(reminder[0] + "  | Urgency: " + (reminder[1] === 3 ? "High Priority" : reminder[1] === 2 ? "Medium Priority" : reminder[1] === 1 ? "Low Priority" : ""));

					todoListGroupedReminderListItem.appendChild(todoListGroupedReminderListItemText);
					todoListGroupedReminderList.appendChild(todoListGroupedReminderListItem);
				});

				todoListDateGroup.appendChild(todoListDateHeader);
				todoListDateGroup.appendChild(todoListGroupedReminderList);
				
				todoListRemindersContainer.appendChild(todoListDateGroup);
			});

			let exitButton = document.createElement("button");
			exitButton.id = "betaCalendarExitButton";
			exitButton.onclick = _self.toggleCalendar;
			let exitImg = document.createElement("img");
			exitImg.src = "./images/exit.png";
			exitButton.appendChild(exitImg);

			let calendarButton = document.createElement("button");
			calendarButton.id = "betaCalendarCalendarButton";
			calendarButton.onclick = _self.todoListToggle;
			let calendarImg = document.createElement("img");
			calendarImg.src = "./images/calendar.png";
			calendarButton.appendChild(calendarImg);

			_self.calendar.container.appendChild(exitButton);
			_self.calendar.container.appendChild(calendarButton);

			for (const element in styling.themes[_self.customization.type].todoList) {
				$("#" + _self.calendar.container.id + " " + element).css(styling.themes[_self.customization.type].todoList[element]);
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

			// set localStorage reminders
			localStorage.setItem("reminders-"+selector.substring(1), JSON.stringify(_self.calendar.reminders));

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
	* Toggles the objects draggable functionality
	*
	* @function
	* @param {element} element the element
	*/
	_self.togglePin = function (element) {
		if (_self.calendar.pinned) {
			_self.makeDraggable(element);
			_self.calendar.pinned = false;
		}
		else {
			_self.unMakeDraggable(element);
			_self.calendar.pinned = true;
		}
	}

	/**
	* Toggles the todo list on or off
	*
	* @function
	*/
	_self.todoListToggle = function () {
		if (_self.currentDisplay === "calendar") {
			_self.currentDisplay = "todoList";
		}
		else {
			_self.currentDisplay = "calendar";
		}

		_self.todoList.groupedReminders = {}
		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}

	/**
	* Deletes a reminder from reminderList
	*
	* @function
	* @param {Object} reminder the reminder to be removed
	*/
	_self.deleteReminder = function (reminder) {
		_self.calendar.reminders = _self.calendar.reminders.filter(rem => rem !== reminder);

		// set localStorage reminders
		localStorage.setItem("reminders-"+selector.substring(1), JSON.stringify(_self.calendar.reminders));

		_self.updateCalendar(_self.calendar.currentPageDate, false);
	}


	// PUBLIC FUNCTIONS


	/**
	* Imports the reminders from the user.
	*
	* @function
	* @param {Object} reminders an array of reminder objects
	*/
	self.importReminders = function (reminders) {
		if (_self.calendar.reminders !== []) {_self.calendar.reminders = reminders;}
		_self.updateCalendar(_self.calendar.currentPageDate, false);

		// set localStorage reminders
		localStorage.setItem("reminders-"+selector.substring(1), JSON.stringify(_self.calendar.reminders));

		_self.calendar.container.style.display = "none";  
	}

	/**
	* Exports the reminders to the user
	*
	* @function
	* @returns {Object} an array of reminder objects
	*/
	self.exportReminders = function () {
		return _self.calendar.reminders;
	}


	// STYLING
	

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
						position: "fixed",
						width: "400px",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						// boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)",
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
					},
					"#betaCalendarPinButton": {
						position: "absolute",
						top: "5px",
						left: "5px",
						width: "30px",
						height: "20px"
					},					
					"#betaCalendarReminderUrgency1": {
						color: "#008000",
					},
					"#betaCalendarReminderUrgency2": {
						color: "#ff6600",
					},
					"#betaCalendarReminderUrgency3": {
						color: "#e60000",
					},
					"#betaCalendarCurrentDayUrgency1": {
						backgroundColor: _self.customization.theme.main,
						color: "#008000",
					},
					"#betaCalendarCurrentDayUrgency2": {
						backgroundColor: _self.customization.theme.main,
						color: "#ff6600",
					},
					"#betaCalendarCurrentDayUrgency3": {
						backgroundColor: _self.customization.theme.main,
						color: "#e60000",
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
						position: "fixed",
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
					"#betaCalendarTodoListButton": {
						position: "absolute",
						bottom: "1%",
						right: "30px",
						width: "55px",
						height: "35px"
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
						verticalAlign: "top",
						bottom: "1%"
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
					}, 
					"#betaCalendarTrashButton": {
						// position: "absolute",
						width: "20px",
						height: "20px",
						marginLeft: "auto",
						// right: "100%"
					}
				},
				todoList: {
					"": {
						fontFamily: "Arial, Helvetica, sans-serif",
						backgroundColor: _self.customization.theme.background,
						padding: "28px 5px 30px 5px",
						position: "fixed",
						width: "40%",
						height: "88%",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						boxShadow: "0px 0px 1px 100vmax rgba(0,0,0,0.8)",
						zIndex: "10000",
						overflowY: "scroll"
					},					
					"header" : {
						margin: "auto",
						marginBottom: "20px",
						fontWeight: "bold",
						fontSize: "100%",
						backgroundColor: _self.customization.theme.main,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						width: "90%",
						height: "10%",
						color: _self.customization.theme.text
					},
					"#betaTodoListTitle" : {
						// margin: "auto",
						textAlign: "center",
						verticalAlign: "top",
					}, 
					"img": {
						width: "100%",
						height: "100%"
					},
					".betaTodoListDateHeader" : {
						margin: "auto",
						fontSize: "100%",
						backgroundColor: _self.customization.theme.main,
						border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						width: "90%",
						height: "15%",
						color: _self.customization.theme.text
					},
					".betaTodoListRemindersList" : {
						margin: "auto",
						marginTop: "10px",
						marginBottom: "10px",
						fontSize: "100%",
						backgroundColor: _self.customization.theme.secondary,
						// border: "1px solid " + _self.customization.theme.text,
						padding: "5px",
						width: "80%",
						height: "10%",
						color: _self.customization.theme.text,
						display: "flex",
						flexDirection: "column", 
						listStyle: "none",
						paddingLeft: "10px"
					},					
					".betaTodoListRemindersListItem" : {
						width: "100%",
						borderBottom: "1px solid " + _self.customization.theme.text,
					},
					"#betaTodoListContainer" : {
						// overflowY: "scroll"
					},
					"#betaCalendarCalendarButton" : {
						position: "absolute",
						top: "2px",
						right: "45px",
						width: "35px",
						height: "24px"
					},					
					"#betaCalendarExitButton" : {
						position: "absolute",
						top: "2px",
						right: "5px",
						width: "35px",
						height: "24px"
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

	return self;
}

global.BetaCalendar = global.BetaCalendar || BetaCalendar
	
})(window, window.document);

