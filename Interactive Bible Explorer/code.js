document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const loadingIndicator = document.getElementById('loading-indicator');
    const sidebarLinks = document.querySelectorAll('.sidebar nav a, .sidebar .dictionary-links a');
    const homeContent = document.getElementById('home-content').innerHTML; // Store initial content

    // URLs for the CSV data
    const DATA_URLS = {
        books: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Book.csv',
        people: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Person.csv',
        places: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-Place.csv',
        naves: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/NavesTopicalDictionary.csv',
        hitchcock: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/HitchcocksBibleNamesDictionary.csv',
        strongs: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/HebrewStrongs.csv',
        // Add other URLs as needed, but be mindful of size for AlamoPolyglot
        // alamo: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/AlamoPolyglot.csv',
        personVerse: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-PersonVerse.csv',
        placeVerse: 'https://raw.githubusercontent.com/BradyStephenson/bible-data/main/BibleData-PlaceVerse.csv'
        // Add more...
    };

    // Store fetched data to avoid refetching (simple cache)
    const cachedData = {};

    // --- Utility Functions ---

    function showLoading() {
        contentArea.innerHTML = ''; // Clear previous content
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    function renderContent(html) {
        hideLoading();
        contentArea.innerHTML = html;
        // Add event listeners for dynamically added content if needed here
        addListItemListeners(); // Re-attach listeners for items like people/places
    }

    function setActiveLink(targetLink) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    // Function to fetch and parse CSV data
    async function fetchCSV(url, cacheKey) {
        if (cachedData[cacheKey]) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData[cacheKey];
        }

        console.log(`Fetching ${cacheKey} from ${url}`);
        showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }
            const csvText = await response.text();
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors.length) {
                            console.error(`Parsing errors for ${url}:`, results.errors);
                            // Optionally reject or resolve with partial data
                            // reject(new Error(`CSV parsing errors for ${url}`));
                        }
                        console.log(`Successfully parsed ${cacheKey}, ${results.data.length} rows`);
                        cachedData[cacheKey] = results.data; // Cache the data
                        resolve(results.data);
                    },
                    error: (error) => {
                        console.error(`PapaParse error for ${url}:`, error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error(`Failed to fetch or parse ${cacheKey}:`, error);
            renderContent(`<p class="error">Failed to load data for ${cacheKey}. Please check the console for details.</p>`);
            return null; // Indicate failure
        } finally {
            // Don't hide loading here, let the calling function do it after rendering
        }
    }

    // --- Display Functions ---

    function displayHome() {
        hideLoading(); // Ensure loading is hidden
        renderContent(`<section>${homeContent}</section>`); // Use stored initial content
    }

    async function displayBooks() {
        const books = await fetchCSV(DATA_URLS.books, 'books');
        if (!books) return; // Fetch failed

        let html = `<h2>Books of the Bible</h2>`;
        html += `<p>Found ${books.length} books. Click a book for more details (details currently limited).</p>`;
        html += `<ul class="item-list">`;
        books.forEach(book => {
            // Ensure properties exist, provide defaults if not
             const name = book.Name || 'Unknown Name';
             const testament = book.Testament || 'N/A';
             const bookId = book.BibleData_BookID || 'N/A';
             const genre = book.Genre || 'N/A';
             // More fields: Chapters, StandardAbbreviation etc.

            html += `<li data-type="book" data-id="${bookId}">
                        <strong>${name}</strong> (${testament}) - Genre: ${genre}
                     </li>`;
        });
        html += `</ul>`;
        html += `<div id="details-area"></div>`; // Placeholder for details

        renderContent(html);
    }


    async function displayPeople() {
        const people = await fetchCSV(DATA_URLS.people, 'people');
         if (!people) return;

        let html = `<h2>Key People</h2>`;
        html += `<p>Found ${people.length} people. Click a name for details (linking to verses requires more data loading).</p>`;
        html += `<ul class="item-list">`;
        people.forEach(person => {
            const personId = person.BibleData_PersonID || 'N/A';
            const name = person.Name || 'Unknown Name';
            const description = person.Description ? `- ${person.Description}` : '';
             // Could add Birth/Death Epoch here if desired

            html += `<li data-type="person" data-id="${personId}">
                        <strong>${name}</strong> ${description}
                     </li>`;
        });
        html += `</ul>`;
        html += `<div id="details-area"></div>`; // Placeholder for details

        renderContent(html);
    }

     async function displayPlaces() {
        const places = await fetchCSV(DATA_URLS.places, 'places');
        if (!places) return;

        let html = `<h2>Key Places</h2>`;
         html += `<p>Found ${places.length} places. Click a name for details.</p>`;
        html += `<ul class="item-list">`;
        places.forEach(place => {
            const placeId = place.BibleData_PlaceID || 'N/A';
            const name = place.Name || 'Unknown Name';
            const latitude = place.Latitude || 'N/A';
            const longitude = place.Longitude || 'N/A';

            html += `<li data-type="place" data-id="${placeId}">
                        <strong>${name}</strong> (Lat: ${latitude}, Lon: ${longitude})
                     </li>`;
        });
        html += `</ul>`;
        html += `<div id="details-area"></div>`; // Placeholder for details

        renderContent(html);
    }

     async function displayTopics() {
        const topics = await fetchCSV(DATA_URLS.naves, 'naves');
         if (!topics) return;

        let html = `<h2>Nave's Topical Dictionary</h2>`;
         html += `<p>Found ${topics.length} topics. (Displaying full references requires linking multiple datasets).</p>`;
        html += `<ul class="item-list">`;
        // Group by topic? For now, just list unique topics
        const uniqueTopics = [...new Set(topics.map(t => t.Topic))].sort();

        uniqueTopics.forEach(topic => {
            html += `<li data-type="topic" data-topic="${topic}">
                        <strong>${topic}</strong>
                     </li>`;
        });
        html += `</ul>`;
        html += `<div id="details-area"></div>`; // Placeholder for details

        renderContent(html);
    }

    async function displayHitchcock() {
        const names = await fetchCSV(DATA_URLS.hitchcock, 'hitchcock');
        if (!names) return;

        let html = `<h2>Hitchcock's Bible Names Dictionary</h2>`;
        html += `<p>Found ${names.length} entries.</p>`;
        html += `<ul class="item-list simple-list">`; // Maybe simpler list style
         names.forEach(entry => {
             const name = entry.Name || 'Unknown Name';
             const meaning = entry.Meaning || 'No meaning provided';
             html += `<li><strong>${name}:</strong> ${meaning}</li>`;
         });
         html += `</ul>`;
         renderContent(html);
    }

     async function displayStrongs() {
         const strongs = await fetchCSV(DATA_URLS.strongs, 'strongs');
         if (!strongs) return;

         let html = `<h2>Hebrew Strong's Numbers</h2>`;
         html += `<p>Found ${strongs.length} entries. (Displaying full details might be slow).</p>`;
         html += `<ul class="item-list simple-list">`;
         // Displaying only a few for performance example
         strongs.slice(0, 100).forEach(entry => { // LIMIT for demo
             const number = entry.StrongsNumber || 'N/A';
             const lemma = entry.Lemma || 'N/A';
             const transliteration = entry.Transliteration || 'N/A';
             const definition = entry.Definition ? entry.Definition.substring(0, 100) + '...' : 'N/A'; // Truncate
             html += `<li><strong>H${number} ${lemma}</strong> (${transliteration}): ${definition}</li>`;
         });
         if (strongs.length > 100) {
            html += `<li>... and ${strongs.length - 100} more entries.</li>`;
         }
         html += `</ul>`;
         renderContent(html);
     }


    function displaySearch() {
        let html = `<h2>Basic Search</h2>`;
        html += `<p>Search People or Places by name (case-insensitive).</p>`;
        html += `<form class="search-form" id="search-form">
                    <input type="text" id="search-query" placeholder="Enter name...">
                    <button type="submit">Search</button>
                 </form>`;
        html += `<div id="search-results"></div>`;
        renderContent(html);

        // Add listener for the search form
        document.getElementById('search-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const query = document.getElementById('search-query').value.trim().toLowerCase();
            const resultsArea = document.getElementById('search-results');
            if (!query) {
                resultsArea.innerHTML = '<p>Please enter a search term.</p>';
                return;
            }

            resultsArea.innerHTML = '<div class="loading">Searching...</div>';

            // Fetch necessary data if not cached
            const people = cachedData.people || await fetchCSV(DATA_URLS.people, 'people');
            const places = cachedData.places || await fetchCSV(DATA_URLS.places, 'places');

            let resultsHtml = '<h3>Results:</h3>';
            let found = false;

            resultsHtml += '<h4>People:</h4><ul class="item-list">';
            const matchingPeople = people ? people.filter(p => p.Name && p.Name.toLowerCase().includes(query)) : [];
            if (matchingPeople.length > 0) {
                found = true;
                matchingPeople.forEach(person => {
                     resultsHtml += `<li data-type="person" data-id="${person.BibleData_PersonID || 'N/A'}">
                                        <strong>${person.Name}</strong> ${person.Description ? `- ${person.Description}` : ''}
                                    </li>`;
                });
            } else {
                resultsHtml += '<li>No matching people found.</li>';
            }
            resultsHtml += '</ul>';

            resultsHtml += '<h4>Places:</h4><ul class="item-list">';
             const matchingPlaces = places ? places.filter(p => p.Name && p.Name.toLowerCase().includes(query)) : [];
             if (matchingPlaces.length > 0) {
                found = true;
                 matchingPlaces.forEach(place => {
                    resultsHtml += `<li data-type="place" data-id="${place.BibleData_PlaceID || 'N/A'}">
                                        <strong>${place.Name}</strong> (Lat: ${place.Latitude || 'N/A'}, Lon: ${place.Longitude || 'N/A'})
                                    </li>`;
                 });
            } else {
                 resultsHtml += '<li>No matching places found.</li>';
            }
             resultsHtml += '</ul>';

             if (!found) {
                resultsArea.innerHTML = '<p>No results found for your query.</p>';
             } else {
                 resultsArea.innerHTML = resultsHtml;
                 addListItemListeners(); // Add listeners to results
             }
        });
    }

     // --- Detail Display Functions (Simplified) ---

     async function displayItemDetails(type, id) {
         const detailsArea = document.getElementById('details-area');
         if (!detailsArea) {
             console.error("Details area not found in current view.");
             return;
         }
         detailsArea.innerHTML = `<div class="loading">Loading details...</div>`;

         let detailsHtml = `<div class="details-view">`;
         let data = null;

         try {
             if (type === 'book') {
                 data = cachedData.books || await fetchCSV(DATA_URLS.books, 'books');
                 const item = data?.find(b => b.BibleData_BookID === id);
                 if (item) {
                     detailsHtml += `<h3>${item.Name || 'Unknown Book'}</h3>`;
                     detailsHtml += `<p><strong>Testament:</strong> ${item.Testament || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Genre:</strong> ${item.Genre || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Chapters:</strong> ${item.Chapters || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Abbreviation:</strong> ${item.StandardAbbreviation || 'N/A'}</p>`;
                     // To show verses, we'd need to fetch/filter AlamoPolyglot - complex!
                     detailsHtml += `<p><em>(Displaying specific verses requires loading/processing the large verse dataset - not implemented in this demo)</em></p>`;
                 } else {
                     detailsHtml += `<p>Details not found for Book ID: ${id}</p>`;
                 }

             } else if (type === 'person') {
                 data = cachedData.people || await fetchCSV(DATA_URLS.people, 'people');
                 const item = data?.find(p => p.BibleData_PersonID === id);
                 if (item) {
                     detailsHtml += `<h3>${item.Name || 'Unknown Person'}</h3>`;
                     detailsHtml += `<p><strong>Description:</strong> ${item.Description || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Born:</strong> Epoch ${item.BirthEpochID || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Died:</strong> Epoch ${item.DeathEpochID || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Gender:</strong> ${item.Gender || 'N/A'}</p>`;
                     // Find related verses (requires another fetch and filter)
                     detailsHtml += await findRelatedVerses('person', id);
                 } else {
                     detailsHtml += `<p>Details not found for Person ID: ${id}</p>`;
                 }

             } else if (type === 'place') {
                  data = cachedData.places || await fetchCSV(DATA_URLS.places, 'places');
                 const item = data?.find(p => p.BibleData_PlaceID === id);
                  if (item) {
                     detailsHtml += `<h3>${item.Name || 'Unknown Place'}</h3>`;
                     detailsHtml += `<p><strong>Latitude:</strong> ${item.Latitude || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Longitude:</strong> ${item.Longitude || 'N/A'}</p>`;
                     detailsHtml += `<p><strong>Accuracy:</strong> ${item.Accuracy || 'N/A'}</p>`;
                      // Find related verses
                      detailsHtml += await findRelatedVerses('place', id);
                 } else {
                     detailsHtml += `<p>Details not found for Place ID: ${id}</p>`;
                 }
             } else if (type === 'topic') {
                 // Topic 'id' is actually the topic string here
                 const topicName = id; // `id` from dataset is the topic name
                  data = cachedData.naves || await fetchCSV(DATA_URLS.naves, 'naves');
                  const items = data?.filter(t => t.Topic === topicName);
                  if (items && items.length > 0) {
                     detailsHtml += `<h3>Topic: ${topicName}</h3>`;
                     detailsHtml += `<p>Found ${items.length} references in Nave's:</p><ul>`;
                     items.forEach(item => {
                         // Displaying the actual verse requires linking BibleData-Reference and then AlamoPolyglot
                         // For now, just show the reference ID or verse reference string if available
                         detailsHtml += `<li>${item.VerseReference || `Ref ID: ${item.BibleData_ReferenceID}`} (See: ${item.See || 'N/A'})</li>`;
                     });
                     detailsHtml += `</ul>`;
                     detailsHtml += `<p><em>(Displaying full verse text is complex and not implemented here.)</em></p>`;
                  } else {
                      detailsHtml += `<p>Details not found for Topic: ${topicName}</p>`;
                  }
             }
              else {
                 detailsHtml += `<p>Details view not implemented for type: ${type}</p>`;
             }

         } catch (error) {
             console.error(`Error displaying details for ${type} ${id}:`, error);
             detailsHtml += `<p class="error">Could not load details.</p>`;
         } finally {
             detailsHtml += `</div>`; // Close details-view
             detailsArea.innerHTML = detailsHtml;
         }
     }


    // Helper to find related verses (simplified, just lists IDs/counts)
     async function findRelatedVerses(entityType, entityId) {
        let verseData = null;
        let relatedVerses = [];
        let url = '';
        let cacheKey = '';
        let idField = '';

        if (entityType === 'person') {
            url = DATA_URLS.personVerse;
            cacheKey = 'personVerse';
            idField = 'BibleData_PersonID';
        } else if (entityType === 'place') {
             url = DATA_URLS.placeVerse;
             cacheKey = 'placeVerse';
             idField = 'BibleData_PlaceID';
        } else {
            return '<p><em>Verse linking not available for this type.</em></p>';
        }

        try {
            verseData = cachedData[cacheKey] || await fetchCSV(url, cacheKey);
             if (verseData) {
                 relatedVerses = verseData.filter(v => v[idField] === entityId);
             }

            if (relatedVerses.length > 0) {
                let verseListHtml = `<p><strong>Mentioned in ${relatedVerses.length} verse records:</strong></p>`;
                // Ideally, fetch AlamoPolyglot here based on VerseIDs, but that's too much client-side
                // Just list the Verse IDs for now as an example
                verseListHtml += `<ul>`;
                relatedVerses.slice(0, 10).forEach(v => { // Limit for demo
                    verseListHtml += `<li>Verse Record ID: ${v.BibleData_VerseID} (Displaying text requires further processing)</li>`;
                });
                 if (relatedVerses.length > 10) verseListHtml += `<li>... and ${relatedVerses.length - 10} more.</li>`;
                verseListHtml += `</ul>`;
                return verseListHtml;
            } else {
                return '<p><em>No specific verse references found in the loaded datasets.</em></p>';
            }
        } catch (error) {
             console.error(`Error finding verses for ${entityType} ${entityId}:`, error);
             return '<p><em>Error loading verse reference data.</em></p>';
        }
     }


    // --- Event Listeners ---

    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const section = event.target.getAttribute('data-section');

            setActiveLink(event.target); // Highlight the clicked link

            // Clear details area if it exists from a previous view
             const detailsArea = document.getElementById('details-area');
             if(detailsArea) detailsArea.innerHTML = '';


            switch (section) {
                case 'home':
                    displayHome();
                    break;
                case 'books':
                    displayBooks();
                    break;
                case 'people':
                    displayPeople();
                    break;
                case 'places':
                    displayPlaces();
                    break;
                 case 'topics':
                     displayTopics();
                     break;
                case 'hitchcock':
                    displayHitchcock();
                    break;
                 case 'strongs':
                     displayStrongs();
                     break;
                 case 'search':
                     displaySearch();
                     break;
                // Add cases for other sections
                default:
                    renderContent(`<p>Section "${section}" not yet implemented.</p>`);
            }
        });
    });

     // Listener for clicks on items within the main content (delegated)
     function addListItemListeners() {
         contentArea.querySelectorAll('.item-list li[data-id], .item-list li[data-topic]').forEach(item => {
            // Prevent adding duplicate listeners if function is called multiple times
             if (item.dataset.listenerAttached) return;
             item.dataset.listenerAttached = true; // Mark as attached

             item.addEventListener('click', (event) => {
                 const target = event.currentTarget; // Use currentTarget to ensure we get the LI
                 const type = target.getAttribute('data-type');
                 const id = target.getAttribute('data-id') || target.getAttribute('data-topic'); // Use data-topic for Naves

                 if (type && id) {
                    console.log(`Clicked item: Type=${type}, ID/Topic=${id}`);
                     // Scroll details into view if needed, or just display them
                     displayItemDetails(type, id);
                 } else {
                     console.warn("Clicked item missing data-type or data-id/data-topic");
                 }
             });
         });
     }


    // --- Initial Load ---
    displayHome(); // Show home content initially
    setActiveLink(document.querySelector('.sidebar a[data-section="home"]')); // Set home link active

}); // End DOMContentLoaded