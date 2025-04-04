document.addEventListener('DOMContentLoaded', () => {
    const contentContainers = document.querySelectorAll('.content-container');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const toggleControlsBtn = document.getElementById('toggle-controls-btn');
    const tabs = document.querySelectorAll('#tabs button');
    let currentSection = 'figures';

    // Figures Filters
    const searchName = document.getElementById('search-name');
    const nameSuggestions = document.getElementById('name-suggestions');
    const genderSelect = document.getElementById('gender');
    const occupationSelect = document.getElementById('occupation');
    const testamentSelect = document.getElementById('testament');
    const sortSelect = document.getElementById('sort');
    // Events Filters
    const searchEvent = document.getElementById('search-event');
    const testamentEvent = document.getElementById('testament-event');
    // Locations Filters
    const searchLocation = document.getElementById('search-location');
    const testamentLocation = document.getElementById('testament-location');

    if (typeof bibleData === 'undefined') {
        console.error("bibleData is not defined. Ensure data.js is loaded first.");
        return;
    }

    // Populate Occupations Dropdown
    const allOccupations = new Set();
    bibleData.figures.forEach(figure => {
        if (Array.isArray(figure.occupation)) {
            figure.occupation.forEach(occ => allOccupations.add(occ));
        } else if (typeof figure.occupation === 'string') {
            allOccupations.add(figure.occupation);
        }
    });
    const occupationList = Array.from(allOccupations).sort();
    occupationSelect.innerHTML = '<option value="all">All</option>' + 
        occupationList.map(occ => `<option value="${occ}">${occ}</option>`).join('');

    function displayFigures(items, container) {
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <div class="dates">${item.birth_year || 'Unknown'} - ${item.death_year || 'Unknown'}</div>
                    <p>${item.description}</p>
                </div>
            `;
            card.addEventListener('click', () => showModal(item));
            container.appendChild(card);
        });
    }

    function displayEvents(items, container) {
        const timeline = container.querySelector('#timeline');
        timeline.innerHTML = '';
        items.sort((a, b) => (a.time_period || '').localeCompare(b.time_period || ''));
        items.forEach(item => {
            const event = document.createElement('div');
            event.className = 'timeline-event';
            event.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.time_period || 'Unknown'}</p>
            `;
            event.addEventListener('click', () => showModal(item));
            timeline.appendChild(event);
        });
    }

    function displayLocations(items, container) {
        const pinsContainer = container.querySelector('#pins');
        pinsContainer.innerHTML = '';
        items.forEach(item => {
            const pin = document.createElement('div');
            pin.className = 'pin';
            pin.style.left = `${item.coords?.x || 50}%`;
            pin.style.top = `${item.coords?.y || 50}%`;
            pin.innerHTML = `<span class="pin-label">${item.name}</span>`;
            pin.addEventListener('click', () => showModal(item));
            pinsContainer.appendChild(pin);
        });
    }

    function showModal(item) {
        document.getElementById('modal-title').textContent = item.name || '';
        document.getElementById('modal-image').src = item.image || '';
        document.getElementById('modal-image').alt = item.name || '';
        document.getElementById('modal-image').style.display = item.image ? 'block' : 'none';
        document.getElementById('modal-description').textContent = item.fullDescription || '';
        document.getElementById('modal-time').textContent = `Time Period: ${item.time_period || 'Unknown'}`;
        document.getElementById('modal-testament').textContent = `Testament: ${item.testament ? item.testament.charAt(0).toUpperCase() + item.testament.slice(1) : 'Unknown'}`;
        document.getElementById('modal-related').textContent = `Related: ${[...(item.related_figures || []), ...(item.related_events || []), ...(item.related_locations || [])].join(', ') || 'None'}`;
        document.getElementById('modal-role').textContent = item.role ? `Role: ${item.role}` : '';
        document.getElementById('modal-scripture').textContent = item.scripture_references ? `Scripture: ${item.scripture_references.join(', ')}` : '';
        document.getElementById('modal-context').textContent = item.historical_context ? `Historical Context: ${item.historical_context}` : '';
        document.getElementById('modal-significance').textContent = item.significance ? `Significance: ${item.significance}` : '';
        
        if (item.category === "figures") {
            document.getElementById('modal-gender').textContent = item.gender ? `Gender: ${item.gender}` : '';
            document.getElementById('modal-tribe').textContent = item.tribe ? `Tribe: ${item.tribe}` : '';
            document.getElementById('modal-occupation').textContent = item.occupation ? `Occupation: ${Array.isArray(item.occupation) ? item.occupation.join(', ') : item.occupation}` : '';
            document.getElementById('modal-family').textContent = item.family ? `Family: ${item.family}` : '';
            document.getElementById('modal-traits').textContent = item.key_traits ? `Key Traits: ${item.key_traits}` : '';
        } else {
            document.getElementById('modal-gender').textContent = '';
            document.getElementById('modal-tribe').textContent = '';
            document.getElementById('modal-occupation').textContent = '';
            document.getElementById('modal-family').textContent = '';
            document.getElementById('modal-traits').textContent = '';
        }

        modal.style.display = 'block';
    }

    function filterAndDisplay() {
        const categories = {
            figures: bibleData.figures,
            events: bibleData.events,
            locations: bibleData.locations
        };

        contentContainers.forEach(container => {
            const category = container.dataset.category;
            let filtered = [...categories[category]];

            if (category === 'figures') {
                const search = searchName.value.toLowerCase();
                if (search) {
                    filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
                    updateSuggestions(filtered);
                }
                const gender = genderSelect.value;
                if (gender !== 'all') {
                    filtered = filtered.filter(item => item.gender && item.gender.toLowerCase() === gender);
                }
                const occupation = occupationSelect.value.toLowerCase();
                if (occupation !== 'all') {
                    filtered = filtered.filter(item => 
                        item.occupation && (Array.isArray(item.occupation) ? 
                            item.occupation.some(occ => occ.toLowerCase() === occupation) : 
                            item.occupation.toLowerCase() === occupation)
                    );
                }
                const testament = testamentSelect.value;
                if (testament !== 'all') {
                    filtered = filtered.filter(item => item.testament === testament);
                }
                const sort = sortSelect.value;
                if (sort === 'chrono') {
                    filtered.sort((a, b) => (a.birth_year || '0').localeCompare(b.birth_year || '0'));
                } else {
                    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                }
                if (container.dataset.category === currentSection) {
                    displayFigures(filtered, container);
                }
            } else if (category === 'events') {
                const search = searchEvent.value.toLowerCase();
                if (search) {
                    filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
                }
                const testament = testamentEvent.value;
                if (testament !== 'all') {
                    filtered = filtered.filter(item => item.testament === testament);
                }
                if (container.dataset.category === currentSection) {
                    displayEvents(filtered, container);
                }
            } else if (category === 'locations') {
                const search = searchLocation.value.toLowerCase();
                if (search) {
                    filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
                }
                const testament = testamentLocation.value;
                if (testament !== 'all') {
                    filtered = filtered.filter(item => item.testament === testament);
                }
                if (container.dataset.category === currentSection) {
                    displayLocations(filtered, container);
                }
            }
        });
    }

    function updateSuggestions(filtered) {
        nameSuggestions.innerHTML = filtered.slice(0, 5).map(item => `<option value="${item.name}">`).join('');
    }

    toggleControlsBtn.addEventListener('click', () => {
        const filtersDiv = document.getElementById('filters');
        const tabsDiv = document.getElementById('tabs');
        if (filtersDiv.classList.contains('visible')) {
            filtersDiv.classList.remove('visible');
            filtersDiv.classList.add('hidden');
            tabsDiv.classList.remove('visible');
            tabsDiv.classList.add('hidden');
            toggleControlsBtn.textContent = 'Show Filters & Tabs';
        } else {
            filtersDiv.classList.remove('hidden');
            filtersDiv.classList.add('visible');
            tabsDiv.classList.remove('hidden');
            tabsDiv.classList.add('visible');
            toggleControlsBtn.textContent = 'Hide Filters & Tabs';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSection = tab.id.replace('tab-', '');
            contentContainers.forEach(container => {
                if (container.dataset.category === currentSection) {
                    container.classList.remove('hidden');
                    container.classList.add('visible');
                } else {
                    container.classList.remove('visible');
                    container.classList.add('hidden');
                }
            });
            document.querySelectorAll('.filter-group').forEach(f => {
                f.classList.add('hidden');
                f.classList.remove('visible');
            });
            document.getElementById(`${currentSection}-filters`).classList.remove('hidden');
            document.getElementById(`${currentSection}-filters`).classList.add('visible');
            filterAndDisplay();
        });
    });

    const timeline = document.getElementById('events-section');
    let isDragging = false;
    let startX, scrollLeft;

    timeline.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - timeline.offsetLeft;
        scrollLeft = timeline.scrollLeft;
    });

    timeline.addEventListener('mouseleave', () => { isDragging = false; });
    timeline.addEventListener('mouseup', () => { isDragging = false; });
    timeline.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - timeline.offsetLeft;
        const walk = (x - startX) * 2;
        timeline.scrollLeft = scrollLeft - walk;
    });

    searchName.addEventListener('input', filterAndDisplay);
    genderSelect.addEventListener('change', filterAndDisplay);
    occupationSelect.addEventListener('change', filterAndDisplay);
    testamentSelect.addEventListener('change', filterAndDisplay);
    sortSelect.addEventListener('change', filterAndDisplay);
    searchEvent.addEventListener('input', filterAndDisplay);
    testamentEvent.addEventListener('change', filterAndDisplay);
    searchLocation.addEventListener('input', filterAndDisplay);
    testamentLocation.addEventListener('change', filterAndDisplay);
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    filterAndDisplay();
});