document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const eventModal = $('#eventModal');
    const eventForm = document.getElementById('eventForm');
    const deleteEventButton = document.getElementById('deleteEvent');
    let currentDate = new Date();

    function loadCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();

        calendar.innerHTML = '';
        
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('header');
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayCell.addEventListener('click', showEventModal);

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            calendar.appendChild(dayCell);
        }

        
        fetchEventsForMonth(year, month + 1); 
    }

    function fetchEventsForMonth(year, month) {
        $.ajax({
            url: 'backend/events.php',
            method: 'POST',
            data: { action: 'list', year, month },
            success: function (response) {
                const events = JSON.parse(response);
                events.forEach(event => {
                    const eventDate = new Date(event.date);
                    const dayCell = document.querySelector(`.day[data-date="${event.date}"]`);
                    if (dayCell) {
                        const eventElement = document.createElement('div');
                        eventElement.classList.add('event');
                        eventElement.textContent = event.title;
                        dayCell.appendChild(eventElement);
                    }
                });
            }
        });
    }

    function showEventModal(e) {
        const date = e.currentTarget.dataset.date;
        $('#eventDate').val(date);
        $('#eventTitle').val('');
        $('#eventDescription').val('');
        $('#eventTime').val('');
        $('#eventId').val('');
        $('#deleteEvent').hide();
        $.ajax({
            url: 'backend/events.php',
            method: 'POST',
            data: { action: 'get', date },
            success: function (response) {
                const data = JSON.parse(response);
                if (data.length > 0) {
                    const event = data[0];
                    $('#eventTitle').val(event.title);
                    $('#eventDescription').val(event.description);
                    $('#eventTime').val(event.time);
                    $('#eventId').val(event.id);
                    $('#deleteEvent').show();
                }
            }
        });
        eventModal.modal('show');
    }

    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = $('#eventId').val();
        const date = $('#eventDate').val();
        const title = $('#eventTitle').val();
        const description = $('#eventDescription').val();
        const time = $('#eventTime').val();
        const action = id ? 'update' : 'add';
        $.ajax({
            url: 'backend/events.php',
            method: 'POST',
            data: { action, id, date, title, description, time },
            success: function (response) {
                loadCalendar(currentDate);
                eventModal.modal('hide');
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    deleteEventButton.addEventListener('click', function () {
        const id = $('#eventId').val();
        $.ajax({
            url: 'backend/events.php',
            method: 'POST',
            data: { action: 'delete', id },
            success: function (response) {
                loadCalendar(currentDate);
                eventModal.modal('hide');
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    loadCalendar(currentDate);
});
