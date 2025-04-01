document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const loadingIndicator = document.getElementById('loading-indicator');
    const sidebarLinks = document.querySelectorAll('.sidebar nav a, .sidebar .dictionary-links a');
    const homeContent = document.getElementById('home-content')?.innerHTML || '<p>Welcome</p>'; // Fallback if not found

    // URLs for the CSV data
    const DATA_URLS = {
        books: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Book.csv',
        people: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Person.csv',
        places: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Place.csv',
        naves: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/NavesTopicalDictionary.csv',
        hitchcock: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/HitchcocksBibleNamesDictionary.csv',
        strongs: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/HebrewStrongs.csv',
        personVerse: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-PersonVerse.csv',
        placeVerse: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-PlaceVerse.csv'
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

    // Case-insensitive property accessor
    function getProp(obj, prop) {
        if (!obj) return 'N/A';
        const keys = Object.keys(obj);
        const key = keys.find(k => k.toLowerCase() === prop.toLowerCase());
        return key ? obj[key] || 'N/A' : 'N/A';
    }

    async function fetchCSV(url, cacheKey) {
        if (cachedData[cacheKey]) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData[cacheKey];
        }

        showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const csvText = await response.text();
            const results = await new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (res) => resolve(res),
                    error: (err) => reject(err)
                });
            });

            if (results.errors.length) {
                console.warn(`Parsing warnings for ${cacheKey}:`, results.errors);
            }
            console.log(`Fetched ${cacheKey}: ${results.data.length} rows`);
            cachedData[cacheKey] = results.data;
            return results.data;
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
        const books = await fetchCSV(DATA_URLS.books, 'books');
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
        const people = await fetchCSV(DATA_URLS.people, 'people');
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
        const places = await fetchCSV(DATA_URLS.places, 'places');
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
        const topics = await fetchCSV(DATA_URLS.naves, 'naves');
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
        const names = await fetchCSV(DATA_URLS.hitchcock, 'hitchcock');
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
        const strongs = await fetchCSV(DATA_URLS.strongs, 'strongs');
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
            const people = await fetchCSV(DATA_URLS.people, 'people');
            const places = await fetchCSV(DATA_URLS.places, 'places');

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
            const books = await fetchCSV(DATA_URLS.books, 'books');
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
            const people = await fetchCSV(DATA_URLS.people, 'people');
            const person = people?.find(p => getProp(p, 'BibleData_PersonID') === id);
            if (person) {
                html += `<h3>${getProp(person, 'Name')}</h3>
                    <p><strong>Description:</strong> ${getProp(person, 'Description')}</p>
                    <p><strong>Gender:</strong> ${getProp(person, 'Gender')}</p>`;
                html += await findRelatedVerses('person', id);
            } else {
                html += `<p>Person ID ${id} not found.</p>`;
            }
        } else if (type === 'place') {
            const places = await fetchCSV(DATA_URLS.places, 'places');
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
            const topics = await fetchCSV(DATA_URLS.naves, 'naves');
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
        const key = type === 'person' ? 'personVerse' : 'placeVerse';
        const url = type === 'person' ? DATA_URLS.personVerse : DATA_URLS.placeVerse;
        const idField = type === 'person' ? 'BibleData_PersonID' : 'BibleData_PlaceID';

        const verses = await fetchCSV(url, key);
        const related = verses?.filter(v => getProp(v, idField) === id) || [];
        if (related.length) {
            return `<p><strong>Found ${related.length} verses:</strong></p><ul>
                ${related.slice(0, 10).map(v => `<li>Verse ID: ${getProp(v, 'BibleData_VerseID')}</li>`).join('')}
                ${related.length > 10 ? `<li>... and ${related.length - 10} more.</li>` : ''}
            </ul>`;
        }
        return '<p>No verses found.</p>';
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