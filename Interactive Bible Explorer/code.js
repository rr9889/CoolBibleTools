document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const loadingIndicator = document.getElementById('loading-indicator');
    const sidebarLinks = document.querySelectorAll('.sidebar nav a, .sidebar .dictionary-links a');
    const homeContent = document.getElementById('home-content')?.innerHTML || '<p>Welcome</p>';

    // URLs for the JSON data
    const DATA_URLS = {
        books: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Book.json',
        people: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Person.json',
        places: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Place.json',
        personLabels: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-PersonLabel.json',
        epochs: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Epoch.json',
        personRelationships: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-PersonRelationship.json',
        personVerse: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-PersonVerse.json',
        personVerseApostolic: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-PersonVerseApostolic.json',
        personVerseTanakh: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-BibleData-PersonVerseTanakh.json',
        placeLabels: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-BibleData-PlaceLabel.json',
        placeVerse: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-BibleData-PlaceVerse.json',
        references: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Reference.json',
        naves: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/NavesTopicalDictionary.json',
        hitchcock: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/HitchcocksBibleNamesDictionary.json',
        strongs: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/HebrewStrongs.json',
        commandments: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Commandments.json',
        events: 'https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-Event.json'
    };

    const cachedData = {};

    // --- Utility Functions ---

    function showLoading() {
        contentArea.innerHTML = '';
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    function renderContent(html) {
        hideLoading();
        contentArea.innerHTML = html;
        addListItemListeners();
    }

    function setActiveLink(targetLink) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        targetLink?.classList.add('active');
    }

    function getProp(obj, prop) {
        if (!obj) return 'N/A';
        const keys = Object.keys(obj);
        const key = keys.find(k => k.toLowerCase() === prop.toLowerCase());
        return key ? (obj[key] || 'N/A') : 'N/A';
    }

    async function fetchJSON(url, cacheKey) {
        if (cachedData[cacheKey]) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData[cacheKey];
        }

        showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log(`Fetched ${cacheKey}: ${Array.isArray(data) ? data.length : Object.keys(data).length} items`);
            cachedData[cacheKey] = data;
            return data;
        } catch (error) {
            console.error(`Failed to fetch ${cacheKey}:`, error);
            renderContent(`<p class="error">Failed to load ${cacheKey} data.</p>`);
            return null;
        }
    }

    // --- Display Functions ---

    function displayHome() {
        renderContent(`<section>${homeContent}</section>`);
    }

    async function displayBooks() {
        const books = await fetchJSON(DATA_URLS.books, 'books');
        if (!books) return;

        let html = `<h2>Books of the Bible</h2><p>Found ${books.length} books.</p><ul class="item-list">`;
        books.forEach(book => {
            const id = getProp(book, 'BibleData_BookID');
            const name = getProp(book, 'Name');
            const testament = getProp(book, 'Testament');
            const genre = getProp(book, 'Genre');
            html += `<li data-type="book" data-id="${id}">
                <strong>${name}</strong> (${testament}) - Genre: ${genre}
            </li>`;
        });
        html += `</ul><div id="details-area"></div>`;
        renderContent(html);
    }

    async function displayPeople() {
        const people = await fetchJSON(DATA_URLS.people, 'people');
        if (!people) return;

        let html = `<h2>Key People</h2><p>Found ${people.length} people.</p><ul class="item-list">`;
        people.forEach(person => {
            const id = getProp(person, 'BibleData_PersonID');
            const name = getProp(person, 'Name');
            const desc = getProp(person, 'Description');
            html += `<li data-type="person" data-id="${id}">
                <strong>${name}</strong>${desc !== 'N/A' ? ` - ${desc}` : ''}
            </li>`;
        });
        html += `</ul><div id="details-area"></div>`;
        renderContent(html);
    }

    async function displayPlaces() {
        const places = await fetchJSON(DATA_URLS.places, 'places');
        if (!places) return;

        let html = `<h2>Key Places</h2><p>Found ${places.length} places.</p><ul class="item-list">`;
        places.forEach(place => {
            const id = getProp(place, 'BibleData_PlaceID');
            const name = getProp(place, 'Name');
            const lat = getProp(place, 'Latitude');
            const lon = getProp(place, 'Longitude');
            html += `<li data-type="place" data-id="${id}">
                <strong>${name}</strong> (Lat: ${lat}, Lon: ${lon})
            </li>`;
        });
        html += `</ul><div id="details-area"></div>`;
        renderContent(html);
    }

    async function displayTopics() {
        const topics = await fetchJSON(DATA_URLS.naves, 'naves');
        if (!topics) return;

        const uniqueTopics = [...new Set(topics.map(t => getProp(t, 'Topic')))].sort();
        let html = `<h2>Nave's Topical Dictionary</h2><p>Found ${uniqueTopics.length} topics.</p><ul class="item-list">`;
        uniqueTopics.forEach(topic => {
            html += `<li data-type="topic" data-topic="${topic}"><strong>${topic}</strong></li>`;
        });
        html += `</ul><div id="details-area"></div>`;
        renderContent(html);
    }

    async function displayHitchcock() {
        const names = await fetchJSON(DATA_URLS.hitchcock, 'hitchcock');
        if (!names) return;

        let html = `<h2>Hitchcock's Bible Names</h2><p>Found ${names.length} entries.</p><ul class="item-list simple-list">`;
        names.forEach(entry => {
            const name = getProp(entry, 'Name');
            const meaning = getProp(entry, 'Meaning');
            html += `<li><strong>${name}:</strong> ${meaning}</li>`;
        });
        html += `</ul>`;
        renderContent(html);
    }

    async function displayStrongs() {
        const strongs = await fetchJSON(DATA_URLS.strongs, 'strongs');
        if (!strongs) return;

        let html = `<h2>Hebrew Strong's</h2><p>Found ${strongs.length} entries (showing 100).</p><ul class="item-list simple-list">`;
        strongs.slice(0, 100).forEach(entry => {
            const num = getProp(entry, 'StrongsNumber');
            const lemma = getProp(entry, 'Lemma');
            const trans = getProp(entry, 'Transliteration');
            const def = getProp(entry, 'Definition').substring(0, 100) + '...';
            html += `<li><strong>H${num} ${lemma}</strong> (${trans}): ${def}</li>`;
        });
        if (strongs.length > 100) html += `<li>... and ${strongs.length - 100} more.</li>`;
        html += `</ul>`;
        renderContent(html);
    }

    async function displaySearch() {
        const html = `
            <h2>Search</h2>
            <form id="search-form">
                <input type="text" id="search-query" placeholder="Enter name...">
                <button type="submit">Search</button>
            </form>
            <div id="search-results"></div>`;
        renderContent(html);

        document.getElementById('search-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('search-query').value.trim().toLowerCase();
            const resultsArea = document.getElementById('search-results');
            if (!query) {
                resultsArea.innerHTML = '<p>Enter a search term.</p>';
                return;
            }

            resultsArea.innerHTML = '<div class="loading">Searching...</div>';
            const people = await fetchJSON(DATA_URLS.people, 'people');
            const places = await fetchJSON(DATA_URLS.places, 'places');

            let resultsHtml = '<h3>Results:</h3>';
            const peopleMatches = people?.filter(p => getProp(p, 'Name').toLowerCase().includes(query)) || [];
            const placeMatches = places?.filter(p => getProp(p, 'Name').toLowerCase().includes(query)) || [];

            resultsHtml += '<h4>People:</h4><ul class="item-list">';
            peopleMatches.forEach(p => {
                resultsHtml += `<li data-type="person" data-id="${getProp(p, 'BibleData_PersonID')}">
                    <strong>${getProp(p, 'Name')}</strong>${getProp(p, 'Description') !== 'N/A' ? ` - ${getProp(p, 'Description')}` : ''}
                </li>`;
            });
            if (!peopleMatches.length) resultsHtml += '<li>No matches.</li>';
            resultsHtml += '</ul>';

            resultsHtml += '<h4>Places:</h4><ul class="item-list">';
            placeMatches.forEach(p => {
                resultsHtml += `<li data-type="place" data-id="${getProp(p, 'BibleData_PlaceID')}">
                    <strong>${getProp(p, 'Name')}</strong> (Lat: ${getProp(p, 'Latitude')}, Lon: ${getProp(p, 'Longitude')})
                </li>`;
            });
            if (!placeMatches.length) resultsHtml += '<li>No matches.</li>';
            resultsHtml += '</ul>';

            resultsArea.innerHTML = resultsHtml;
            addListItemListeners();
        });
    }

    async function displayItemDetails(type, id) {
        const detailsArea = document.getElementById('details-area');
        if (!detailsArea) return;

        detailsArea.innerHTML = '<div class="loading">Loading...</div>';
        let html = '<div class="details-view">';

        if (type === 'book') {
            const books = await fetchJSON(DATA_URLS.books, 'books');
            const book = books?.find(b => getProp(b, 'BibleData_BookID') === id);
            if (book) {
                html += `<h3>${getProp(book, 'Name')}</h3>
                    <p><strong>Testament:</strong> ${getProp(book, 'Testament')}</p>
                    <p><strong>Genre:</strong> ${getProp(book, 'Genre')}</p>
                    <p><strong>Chapters:</strong> ${getProp(book, 'Chapters')}</p>`;
            } else {
                html += `<p>Book ID ${id} not found.</p>`;
            }
        } else if (type === 'person') {
            const people = await fetchJSON(DATA_URLS.people, 'people');
            const epochs = await fetchJSON(DATA_URLS.epochs, 'epochs');
            const person = people?.find(p => getProp(p, 'BibleData_PersonID') === id);
            if (person) {
                const birthEpoch = epochs?.find(e => getProp(e, 'BibleData_EpochID') === getProp(person, 'BirthEpochID'));
                const deathEpoch = epochs?.find(e => getProp(e, 'BibleData_EpochID') === getProp(person, 'DeathEpochID'));
                html += `<h3>${getProp(person, 'Name')}</h3>
                    <p><strong>Description:</strong> ${getProp(person, 'Description')}</p>
                    <p><strong>Gender:</strong> ${getProp(person, 'Gender')}</p>
                    <p><strong>Born:</strong> ${birthEpoch ? getProp(birthEpoch, 'Name') : getProp(person, 'BirthEpochID')}</p>
                    <p><strong>Died:</strong> ${deathEpoch ? getProp(deathEpoch, 'Name') : getProp(person, 'DeathEpochID')}</p>`;
                html += await findRelatedVerses('person', id);
                html += await findRelationships(id);
            } else {
                html += `<p>Person ID ${id} not found.</p>`;
            }
        } else if (type === 'place') {
            const places = await fetchJSON(DATA_URLS.places, 'places');
            const place = places?.find(p => getProp(p, 'BibleData_PlaceID') === id);
            if (place) {
                html += `<h3>${getProp(place, 'Name')}</h3>
                    <p><strong>Latitude:</strong> ${getProp(place, 'Latitude')}</p>
                    <p><strong>Longitude:</strong> ${getProp(place, 'Longitude')}</p>`;
                html += await findRelatedVerses('place', id);
            } else {
                html += `<p>Place ID ${id} not found.</p>`;
            }
        } else if (type === 'topic') {
            const topics = await fetchJSON(DATA_URLS.naves, 'naves');
            const items = topics?.filter(t => getProp(t, 'Topic') === id);
            if (items?.length) {
                html += `<h3>Topic: ${id}</h3><ul>`;
                items.forEach(item => {
                    html += `<li>${getProp(item, 'VerseReference') || `Ref ID: ${getProp(item, 'BibleData_ReferenceID')}`}</li>`;
                });
                html += '</ul>';
            } else {
                html += `<p>Topic ${id} not found.</p>`;
            }
        }
        html += '</div>';
        detailsArea.innerHTML = html;
    }

    async function findRelatedVerses(type, id) {
        const urls = type === 'person' ? [DATA_URLS.personVerse, DATA_URLS.personVerseApostolic, DATA_URLS.personVerseTanakh] : [DATA_URLS.placeVerse];
        const cacheKeys = type === 'person' ? ['personVerse', 'personVerseApostolic', 'personVerseTanakh'] : ['placeVerse'];
        const idField = type === 'person' ? 'BibleData_PersonID' : 'BibleData_PlaceID';

        let allVerses = [];
        for (let i = 0; i < urls.length; i++) {
            const verses = await fetchJSON(urls[i], cacheKeys[i]);
            if (verses) {
                allVerses = allVerses.concat(verses.filter(v => getProp(v, idField) === id));
            }
        }

        if (allVerses.length) {
            return `<p><strong>Found ${allVerses.length} verses:</strong></p><ul>
                ${allVerses.slice(0, 10).map(v => `<li>Verse ID: ${getProp(v, 'BibleData_VerseID')}</li>`).join('')}
                ${allVerses.length > 10 ? `<li>... and ${allVerses.length - 10} more.</li>` : ''}
            </ul>`;
        }
        return '<p>No verses found.</p>';
    }

    async function findRelationships(personId) {
        const relationships = await fetchJSON(DATA_URLS.personRelationships, 'personRelationships');
        const people = cachedData.people || await fetchJSON(DATA_URLS.people, 'people');
        if (!relationships || !people) return '';

        const related = relationships.filter(r => getProp(r, 'BibleData_PersonID1') === personId || getProp(r, 'BibleData_PersonID2') === personId);
        if (!related.length) return '<p>No relationships found.</p>';

        let html = '<p><strong>Relationships:</strong></p><ul>';
        related.forEach(rel => {
            const otherId = getProp(rel, 'BibleData_PersonID1') === personId ? getProp(rel, 'BibleData_PersonID2') : getProp(rel, 'BibleData_PersonID1');
            const otherPerson = people.find(p => getProp(p, 'BibleData_PersonID') === otherId);
            const relType = getProp(rel, 'RelationshipType');
            html += `<li>${relType} of <strong>${otherPerson ? getProp(otherPerson, 'Name') : otherId}</strong></li>`;
        });
        html += '</ul>';
        return html;
    }

    // --- Event Listeners ---

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            setActiveLink(link);
            const detailsArea = document.getElementById('details-area');
            if (detailsArea) detailsArea.innerHTML = '';

            const displays = {
                home: displayHome,
                books: displayBooks,
                people: displayPeople,
                places: displayPlaces,
                topics: displayTopics,
                hitchcock: displayHitchcock,
                strongs: displayStrongs,
                search: displaySearch
            };
            displays[section]?.() || renderContent(`<p>Section "${section}" not implemented.</p>`);
        });
    });

    function addListItemListeners() {
        contentArea.querySelectorAll('.item-list li[data-id], .item-list li[data-topic]').forEach(item => {
            if (item.dataset.listener) return;
            item.dataset.listener = 'true';
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const id = item.getAttribute('data-id') || item.getAttribute('data-topic');
                if (type && id) displayItemDetails(type, id);
            });
        });
    }

    // --- Initial Load ---
    displayHome();
    setActiveLink(document.querySelector('.sidebar a[data-section="home"]'));
});
