
        let events = JSON.parse(localStorage.getItem('may2025Events')) || [];
        let currentEventId = null;
        const calendarEl = document.getElementById('calendar');
        const eventModalEl = document.getElementById('eventModal');
        const eventFormEl = document.getElementById('eventForm');
        const modalTitleEl = document.getElementById('modalTitle');
        const eventIdEl = document.getElementById('eventId');
        const eventDayEl = document.getElementById('eventDay');
        const eventNameEl = document.getElementById('eventName');
        const eventTimeEl = document.getElementById('eventTime');
        const eventDescriptionEl = document.getElementById('eventDescription');
        const eventColorEl = document.getElementById('eventColor');
        const deleteBtnEl = document.getElementById('deleteBtn');
        const cancelBtnEl = document.getElementById('cancelBtn');
        const closeModalEl = document.getElementById('closeModal');
        function initCalendar() {
            const startDay = 4;
            const daysInMonth = 31;
            for (let i = 0; i < startDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'day';
                calendarEl.appendChild(emptyDay);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
                dayEl.innerHTML = `
                    <div class="day-number">${day}</div>
                    <div class="events-container" id="day-${day}-events"></div>
                    <button class="add-event-btn" data-day="${day}">+</button>
                `;
                calendarEl.appendChild(dayEl);
                dayEl.querySelector('.add-event-btn').addEventListener('click', (e) => {
                    openAddModal(parseInt(e.target.getAttribute('data-day')));
                });
            }
            renderEvents();
        }
        function renderEvents() {
            document.querySelectorAll('[id^="day-"]').forEach(el => {
                el.innerHTML = '';
            });
            events.forEach(event => {
                const day = parseInt(event.day);
                const eventEl = document.createElement('div');
                eventEl.className = 'event';
                eventEl.style.backgroundColor = event.color;
                eventEl.style.borderLeftColor = darkenColor(event.color, 30);
                eventEl.innerHTML = `
                    <div>${event.name}</div>
                    ${event.time ? `<div class="event-details">${event.time}</div>` : ''}
                `;
                eventEl.addEventListener('click', () => {
                    openEditModal(event);
                });
                
                const container = document.getElementById(`day-${day}-events`);
                if (container) {
                    container.appendChild(eventEl);
                }
            });
        }
        function openAddModal(day) {
            modalTitleEl.textContent = 'Add Event';
            eventFormEl.reset();
            eventIdEl.value = '';
            eventDayEl.value = day;
            deleteBtnEl.style.display = 'none';
            const now = new Date();
            eventTimeEl.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            eventModalEl.style.display = 'flex';
        }
        function openEditModal(event) {
            modalTitleEl.textContent = 'Edit Event';
            eventIdEl.value = event.id;
            eventDayEl.value = event.day;
            eventNameEl.value = event.name;
            eventTimeEl.value = event.time || '';
            eventDescriptionEl.value = event.description || '';
            eventColorEl.value = event.color;
            deleteBtnEl.style.display = 'block';
            
            eventModalEl.style.display = 'flex';
        }
        function closeModal() {
            eventModalEl.style.display = 'none';
        }
        function saveEvent(eventData) {
            if (eventData.id) {
                const index = events.findIndex(e => e.id === eventData.id);
                if (index !== -1) {
                    events[index] = eventData;
                }
            } else {
                eventData.id = Date.now().toString();
                events.push(eventData);
            }
            localStorage.setItem('may2025Events', JSON.stringify(events));
            renderEvents();
            closeModal();
        }
        function deleteEvent(eventId) {
            events = events.filter(e => e.id !== eventId);
            localStorage.setItem('may2025Events', JSON.stringify(events));
            renderEvents();
            closeModal();
        }
        function darkenColor(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return "#" + (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            ).toString(16).slice(1);
        }
        eventFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventData = {
                id: eventIdEl.value,
                day: eventDayEl.value,
                name: eventNameEl.value,
                time: eventTimeEl.value,
                description: eventDescriptionEl.value,
                color: eventColorEl.value
            };
            saveEvent(eventData);
        });
        deleteBtnEl.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(eventIdEl.value);
            }
        });
        cancelBtnEl.addEventListener('click', closeModal);
        closeModalEl.addEventListener('click', closeModal);
        eventModalEl.addEventListener('click', (e) => {
            if (e.target === eventModalEl) {
                closeModal();
            }
        });
        initCalendar();
 