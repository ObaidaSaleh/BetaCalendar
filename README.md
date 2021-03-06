# BetaCalendar.js - Create simple yet appealing ogranization widgets.

Welcome to BetaCalendar! This library is designed to provide developers with easy to use organization-based widgets.

[Click here to see examples!](https://beta-calendar.herokuapp.com/)

## Getting Started

BetaCalendar offers various organizational-based widgets with simple to implement customization.

To use BetaCalendar you must first include two javascript files at the top of your page, one is the BetaCalendar library, and the other is jquery. (jquery version 3.5.1 was used for the creation of BetaCalendar)

```javascript
<script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
```

```javascript
<script defer type="text/javascript" src='BetaCalendar.js'></script>
```

## Documentation

BetaCalendar has very indepth documentation outlining the specific parameters and data types required to customize your own widgets!

[Click here to see the documentation!](https://beta-calendar.herokuapp.com/docs.html)

## Sample code

Here you can see a quick example of a basic implementation of a BetaCalendar widget.

```javascript
const calendar1 = new BetaCalendar("#normalCalendar");
```
All you need to do is call the constructor with an id as a parameter. The id is a required input and tells the library what component to attach the calendar to, so that it toggles when that component is clicked.
