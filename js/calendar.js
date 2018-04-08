// calendar variables
var currentDate = new Date();
var currentMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());

// user variables
var loggedIn = false;
var userId;
var username;
var csrfToken;

var EVENT_COLORS = {
    "bold_blue": Color(84, 132, 237), // #5484ED
    "blue": Color(164, 189, 252), // #A4BDFC
    "turquoise": Color(70, 214, 219), // #46D6DB
    "green": Color(122, 231, 191), // #7AE7BF
    "bold_green": Color(81, 183, 73), // #51B749
    "yellow": Color(251, 215, 91), // #FBD75B
    "orange": Color(255, 184, 120), // #FFB878
    "red": Color(255, 136, 124), // #FF887C
    "bold_red": Color(220, 33, 39), // #DC2127
    "purple": Color(219, 173, 255), // #DBADFF
    "gray": Color(225, 225, 225) // #E1E1E1
};

var EVENT_COLORS_HEX_CODES = {
        "bold_blue": "#5484ED",
        "blue": "#A4BDFC",
        "turquoise": "#46D6DB",
        "green": "#7AE7BF",
        "bold_green": "#51B749",
        "yellow": "#FBD75B",
        "orange": "#FFB878",
        "red": "#FF887C",
        "bold_red": "#DC2127",
        "purple": "#DBADFF",
        "gray": "#E1E1E1"
    };

$(document).ready(function () {
    updateCalendarHeader();
    updateCalendar();
    // (add events after retrieving user info)
    updateUserInfo();

    $("#user-calendars").hide();

    $("#next_month_btn").click(function (event) {
        currentMonth = currentMonth.nextMonth();
        updateCalendarHeader();
        updateCalendar();
        addEvents();
        getCalendars();
    });

    $("#prev_month_btn").click(function (event) {
        currentMonth = currentMonth.prevMonth();
        updateCalendarHeader();
        updateCalendar();
        addEvents();
        getCalendars();
    });

    $("#today_btn").click(function (event) {
        currentMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());
        updateCalendarHeader();
        updateCalendar();
        addEvents();
        getCalendars();
    });

    $("#calendar-nav-button").click(function (event) {
        showCalendar();
    });

    $(".login-nav-btn").click(function (event) {
        showLoginForm();
    });

    $(".register-nav-btn").click(function (event) {
        showRegistrationForm();
    });

    $(".login-form-btn").click(function (event) {
        logInUser();
    });

    $(".register-form-btn").click(function (event) {
        registerUser();
    });

    $("#logout-nav-button").click(function (event) {
        logoutUser();
    });

    $("#create-event-nav-btn").click(function (event) {
        showCreateEventForm();
    });

    $("#create-event-btn").click(function (event) {
        createEvent();
    });

    $("#edit-event-btn").click(function (event) {
        updateEvent();
    });

    $("#show-create-cal-btn").click(function (event) {
        showCreateCalendarForm();
    });

    $("#create-calendar-btn").click(function (event) {
        createCalendar();
    });

    $("#edit-calendar-btn").click(function (event) {
        updateUserCalendar();
    });
});

/* UI functions */
function updateCalendar() {
    $("#calendar-body").empty();
    var weeks = currentMonth.getWeeks();

    var w;
    for (w in weeks) {
        if (weeks.hasOwnProperty(w)) {
        var days = weeks[w].getDates();

        // days contains normal JavaScript Date objects.
        var d;
        for (d in days) {
            if (days.hasOwnProperty(d)) {
            var $gridItemDiv = $('<div class="grid-item"></div>');
            var $daySpan = $('<span class="day"></span>');

            var day = days[d];
            var dayLabel;
            if (day.getDate() == 1) {
                dayLabel = getShortMonthNameFromIndex(day.getMonth()) + " " + day.getDate();
            } else {
                dayLabel = day.getDate();
            }

            if (day.getMonth() != currentMonth.month) {
                $daySpan.css("color", "gray");
            } else if (day.getDate() == currentDate.getDate() && day.getMonth() == currentDate.getMonth() &&
                day.getFullYear() == currentDate.getFullYear()) {
                $gridItemDiv.css({
                    "background": "#eaeaea",
                    "border": "1px solid #666"
                });
                $daySpan.css({
                    "font-weight": "bold",
                    "color": "#222"
                });
            }

            // add formatted date to grid item div
            var date = formatDate(day);
            $gridItemDiv.addClass(date);

            $("#calendar-body").append(
                $gridItemDiv.append(
                    $daySpan.append(dayLabel)
                )
            );
        }
        }
    }
    }
}

function updateCalendarHeader() {
    $("#current-month").text(getMonthNameFromIndex(currentMonth.month));
    $("#current-year").text(currentMonth.year);
}

function showCalendar() {
    $("#calendar").show();
    $("#calendar-controls").show();
    $("#login-form").hide();
    $("#register-form").hide();
    $("#create-event-form").hide();
    $("#edit-event-form").hide();
    $("#user-calendars").show();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").hide();
}

function showLoginForm() {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").show();
    $("#register-form").hide();
    $("#create-event-form").hide();
    $("#edit-event-form").hide();
    $("#user-calendars").hide();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").hide();
}

function showRegistrationForm() {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").hide();
    $("#register-form").show();
    $("#create-event-form").hide();
    $("#edit-event-form").hide();
    $("#user-calendars").hide();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").hide();
}

function showCreateEventForm() {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").hide();
    $("#register-form").hide();
    $("#create-event-form").show();
    $("#edit-event-form").hide();
    $("#user-calendars").hide();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").hide();
}

function showEditEventForm(eventId, createdBy, title, date, startTime, finishTime, color) {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").hide();
    $("#register-form").hide();
    $("#create-event-form").hide();
    $("#edit-event-form").show();
    $("#user-calendars").hide();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").hide();
    $("#edit-event-id").val(eventId);
    $("#edit-title").val(title);
    $("#edit-date").val(date);
    $("#edit-start_time").val(startTime);
    $("#edit-finish_time").val(finishTime);
    $("#edit-color").val(colorStringToHex(color));
}

function showCreateCalendarForm() {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").hide();
    $("#register-form").hide();
    $("#create-event-form").hide();
    $("#edit-event-form").hide();
    $("#user-calendars").hide();
    $("#create-calendar-form").show();
    $("#edit-calendar-form").hide();
}

function showEditCalendarForm(calendarId, createdBy, name) {
    $("#calendar").hide();
    $("#calendar-controls").hide();
    $("#login-form").hide();
    $("#register-form").hide();
    $("#create-event-form").hide();
    $("#edit-event-form").hide();
    $("#user-calendars").hide();
    $("#create-calendar-form").hide();
    $("#edit-calendar-form").show();
    $("#edit-calendar-id").val(calendarId);
    $("#edit-name").val(name);
}

function updateUserViews() {
    if (loggedIn) {
        $("#user-welcome-message").show();
        $("#user-welcome-message").text("Hello, " + username + "!");
        $("#logout-item").show();
        $(".show-anonymous-user").hide();
        $("#create-event-item").show();
    } else {
        $("#user-welcome-message").empty();
        $("#user-welcome-message").hide();
        $("#logout-item").hide();
        $(".show-anonymous-user").show();
        $("#create-event-item").hide();
    }
}

// add color selector controls
function showEventColorControls() {
    $("#event-color-controls").remove();
    var $calControls = $("#calendar-controls");
    var $p = $("<p id='event-color-controls'></p>");
    var $ul = $("<ul></ul>");
    var color;
    for (color in EVENT_COLORS_HEX_CODES) {
        if (EVENT_COLORS_HEX_CODES.hasOwnProperty(color))  {
        var hex = EVENT_COLORS_HEX_CODES[color];
        var $li = $("<li></li>");
        var $checkbox = $("<input type='checkbox' name='event-color' value='" + color + "' checked>");
        $checkbox.change(setEventColorListener(color));

        $li.css({'background-color': hex, 'float': 'left', 'display': 'inline'});
        $ul.append(
                   $li.append($checkbox));
    }
    }
    $calControls.append(
                        $p.append($ul));
}

function setEventColorListener(color) {
    return function(event) {
            var colorClass = "." + color;
            var $elts = $(colorClass);
            if (this.checked) {
                $elts.show();
                console.log("showing " + colorClass);
                console.log($elts);
            } else {
                $elts.hide();
                console.log("hiding " + colorClass);
                console.log($elts);
            }
        };
}


/* Backend functions */
function registerUser() {
    var url = "register.php";
    var $form = $(".register-form");

    $("#error-div").empty();
    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        console.log(data);
        if (data.success) {
            loggedIn = true;
            userId = data.user_id;
            username = data.username;
            csrfToken = data.token;
            showCalendar();
            updateUserViews();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: " + data.message);
            $("#error-div").text(data.message);
        }
    });
}

function logInUser() {
    var url = "login.php";
    var $form = $(".login-form");
    $("#error-div").empty();
    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        console.log(data);
        if (data.success) {
            loggedIn = true;
            userId = data.user_id;
            username = data.username;
            csrfToken = data.token;
            showCalendar();
            updateUserViews();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: " + data.message);
            $("#error-div").text(data.message);
        }
    });
}

function logoutUser() {
    var url = "logout.php";
    // var $form = $(".logout-form");
    $("#error-div").empty();

    $.post(url, serializeFormAndToken(csrfToken), function (data, status) {
        if (data.success) {
            loggedIn = false;
            userId = null;
            username = null;
            csrfToken = null;
            console.log("User logged out successfully");
            updateUserViews();
            updateCalendar();
            showLoginForm();
        } else {
            console.log("Error: Could not log user out");
        }
    });
}

function createEvent() {
    var url = "create_event.php";
    var $form = $(".create-event-form");
    $("#error-div").empty();

    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        if (data.success) {
            console.log("Event created successfully");
            console.log("Title: " + data.title + ",  Date: " + data.date + ", start time: " + data.start_time + ", finish time: " + data.finish_time);
            showCalendar();
            updateCalendar();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: Event could not be created");
            $("#error-div").text(data.message);
        }
    });
}

function addEvents() {
    var url = "get_events.php";
    $("#error-div").empty();
    $('.grid-item p').remove();

    $.post(url, serializeFormAndToken(csrfToken), function (data, success) {
        if (data.success) {
            console.log(data.message);
            var results = data.results;

            for (var i = 0; i < results.event_id_list.length; i++) {
                var eventId = results.event_id_list[i];
                var createdBy = results.created_by_list[i]; // not used
                var title = results.title_list[i];
                var date = results.date_list[i];
                var startTime = results.start_time_list[i];
                var finishTime = results.finish_time_list[i];
                var color = results.color_list[i];
                var calendarId = results.calendar_id_list[i];
                var calendarName = results.calendar_name_list[i];

                var $p = $('<p></p>');

                var $a = $('<a href="#">' + title + '</a>');

                $a.css("color", 'black');

                var displayColor = EVENT_COLORS[color];
                var displayRGB = "rgb(" + displayColor.red + ", " + displayColor.green + ", " + displayColor.blue + ")";
                $p.css( "background-color", displayRGB );
                var calClass = "cal-id-" + calendarId;
                $p.addClass(color + " " +calClass);
                $a.click(createEventDetailsDialogCallback(eventId, createdBy, title, date, startTime, finishTime, color, calendarId, calendarName));

                var selector = '.' + date;
                $(selector).append(
                    $p.append($a)
                );
            }

            showEventColorControls();
        } else {
            console.log("Error: could not add events");
        }
    });
}

function updateEvent() {
    var url = "update_event.php";
    var $form = $(".edit-event-form");
    $("#error-div").empty();

    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        console.log(data);
        if (data.success) {
            console.log("Event updated successfully");
            console.log("Title: " + data.title + ",  Date: " + data.date + ", start time: " + data.start_time + ", finish time: " + data.finish_time + ", color: " + data.color);
            showCalendar();
            updateCalendar();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: Event could not be updated");
            $("#error-div").text(data.message);
        }
    });
}

function deleteEvent($div, eventId) {
    var deleteUrl = "delete_event.php";
    var params = {
        event_id: eventId,
        token: csrfToken
    };
    $.post(deleteUrl, params, function (data, status) {
        if (data.success) {
            console.log("Event deleted");
            $div.dialog("close");
            updateCalendar();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: Event could not be deleted");
        }
    });
}

function createEventDetailsDialogCallback(eventId, createdBy, title, date, startTime, finishTime, color, calendarId, calendarName) {
    return function () {
        var $div = $("<div title='View Event'></div>");
        var $strong = $("<strong></strong>");
        var $dialogParagraph = $('<p></p>');
        $dialogParagraph.css('text-align', 'center');
        var $date = $('<p><strong>Date:</strong></p>');
        var $time = $('<p><strong>Time:</strong></p>');
        var hex = colorStringToHex(color);
        var $color = $('<p><strong>Color:</strong></p>');
        var $colorDisplay = $("<span>" + color + "</span>");
        $colorDisplay.css("color", hex);
        var $calName = $('<p><strong>Calendar:</strong></p>');

        var timeString = formatTime(startTime) + ' - ' + formatTime(finishTime);
        $div.append(
            $dialogParagraph.append($strong.append(title))).append($date)
            .append(date)
            .append($('<br>'))
            .append($time)
            .append(timeString)
            .append('<br>')
            .append($color)
            .append($colorDisplay)
            .append('<br>')
            .append($calName)
            .append(calendarName)
            .append($('<br>'));

        $div.dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            draggable: false,
            buttons: {
                "Delete": function () {
                    deleteEvent($div, eventId);
                },
                "Edit event": function () {
                    $(this).dialog("close");
                    var formattedStart = startTime.split(" ")[1].substring(0, startTime.split(" ")[1].length - 3);
                    var formattedFinish = finishTime.split(" ")[1].substring(0, finishTime.split(" ")[1].length - 3);
                    showEditEventForm(eventId, createdBy, title, date, formattedStart, formattedFinish, color);
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
}

function updateUserInfo() {
    var url = "get_info.php";
    $.post(url, serializeFormAndToken(), function (data, status) {
        if (data.success) {
            loggedIn = true;
            userId = data.user_id;
            username = data.username;
            csrfToken = data.token;
            updateUserViews();
            addEvents();
            getCalendars();
        } else {
            loggedIn = false;
            updateUserViews();
        }
    });
}

function getCalendars() {
    $("#user-calendar-list").empty();
    $("#create-event-calendar").empty();
    $("#update-event-calendar").empty();

    var url = "get_calendars.php";
    var params = {
        token: csrfToken
    };
    $.post(url, params, function (data, status) {
        if (data.success) {
            $("#user-calendars").show();
            console.log(data.message);
            var results = data.results;

            for (var i = 0; i < results.id_list.length; i++) {
                var calendarId = results.id_list[i];
                var createdBy = results.created_by_list[i];
                var name = results.name_list[i];

                // populate user calendar list

                var $a = $('<a href="#">' + name + '</a>');

                $a.click(createCalendarDetailsDialogCallback(calendarId, createdBy, name));

                var $li = $("<li></li>");
                $("#user-calendar-list").append(
                                           $li.append($a));

                // populate create event with calendars
                var $option = $("<option></option>");
                $option.val(calendarId);
                $option.text(name);
                $("#create-event-calendar").append($option);

                // populate update event with calendars
                $("#update-event-calendar").append($option.clone());

                //  set event listeners

            }
        } else {
            console.log("Error: Calendars could not be fetched");
        }
    });
}

function createCalendarDetailsDialogCallback(calendarId, createdBy, name) {
        return function () {
            var $div = $("<div title='Calendar Details'></div>");
            var $name = $('<p><strong>Name</strong></p>');
            $div.append($name)
                .append(name
            );
            console.log($div);
            $div.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        console.log($div);
                        deleteCalendar($div, calendarId);
                    },
                    "Edit calendar": function () {
                        $(this).dialog("close");
                        showEditCalendarForm(calendarId, createdBy, name);
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }
            });
    };
}

function createCalendar() {
    var url = "create_calendar.php";
    var $form = $(".create-calendar-form");
    $("#error-div").empty();

    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        if (data.success) {
            console.log("Calendar created successfully");
            console.log("Name: " + data.name);
            showCalendar();
            getCalendars();
        } else {
            console.log("Error: Calendar could not be created");
            $("#error-div").text(data.message);
        }
    });
}

function deleteCalendar($div, calendarId) {
    var url = "delete_calendar.php";
    var params = {
        calendar_id: calendarId,
        token: csrfToken
    };
    console.log($div);
    $.post(url, params, function (data, status) {
        if (data.success) {
            console.log("Calendar deleted");
            $div.dialog("close");
            console.log($div);
            updateCalendar();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: Calendar could not be deleted");
        }
    });
}

function updateUserCalendar() {
    var url = "update_calendar.php";
    var $form = $(".edit-calendar-form");
    $("#error-div").empty();

    $.post(url, serializeFormAndToken(csrfToken, $form), function (data, status) {
        console.log(data);
        if (data.success) {
            console.log("Event updated successfully");
            console.log("Name: " + data.name);
            showCalendar();
            updateCalendar();
            addEvents();
            getCalendars();
        } else {
            console.log("Error: Calendar could not be updated");
            $("#error-div").text(data.message);
        }
    });
}

/*  helpers */
function getMonthNameFromIndex(monthIndex) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
}

function getShortMonthNameFromIndex(monthIndex) {
    return getMonthNameFromIndex(monthIndex).substring(0, 3);
}

// return date using YYYY-MM-DD format
function formatDate(day) {
    var y = day.getFullYear();
    var m = day.getMonth() + 1;
    var d = day.getDate();

    if (m.toString().length == 1) {
        m = '0' + m;
    }

    if (d.toString().length == 1) {
        d = '0' + d;
    }

    return y + '-' + m + '-' + d;
}

function formatTime(dateTime) {
    var date = new Date(dateTime);
    return date.toLocaleTimeString();
}

function serializeFormAndToken(token, $form) {
    if ($form == undefined) {
        return $.param({
            'token': token
        });
    } else {
        var serialData = $form.serializeArray();
        serialData.push({
            name: 'token',
            value: token
        });
        return $.param(serialData);
    }
}

function colorStringToHex(color) {
    return EVENT_COLORS_HEX_CODES[color];
}

function Color(r, g, b) {
    return {
        red: r,
        green: g,
        blue: b
    };
}
