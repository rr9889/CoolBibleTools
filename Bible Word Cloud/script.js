// Fetch NIV Bible JSON from GitHub
async function fetchBibleData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/jadenzaleski/BibleTranslations/master/NIV/NIV_bible.json');
        if (!response.ok) throw new Error('Failed to fetch NIV Bible JSON');
        return await response.json();
    } catch (e) {
        throw new Error('Could not load Bible data: ' + e.message);
    }
}

// Fetch BibleData-PersonLabel.json from GitHub
async function fetchPersonLabelData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/rr9889/bibletoolsgenology/main/BibleData-PersonLabel.json');
        if (!response.ok) throw new Error('Failed to fetch Person Label JSON');
        return await response.json();
    } catch (e) {
        throw new Error('Could not load Person Label data: ' + e.message);
    }
}

// Define Old and New Testament books
const oldTestamentBooks = new Set([
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Songs", 
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
]);

const newTestamentBooks = new Set([
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", 
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", 
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", 
    "1 John", "2 John", "3 John", "Jude", "Revelation"
]);

// Precompute statistics and generate categories
async function precomputeStats(bibleData, personLabelData) {
    const wordStats = new Map();
    const phraseStats = new Map();
    const capitalizedWords = new Map(); // For locations and other categories

    // Seed lists for disambiguation (minimal hardcoded data)
    const locationSuffixes = new Set(['ah', 'el', 'eth', 'on', 'us', 'ia', 'an']);
    const commonWords = new Set(['the', 'and', 'of', 'to', 'in', 'a', 'that', 'he', 'was', 'it']);

    // Process Bible text
    for (const book in bibleData) {
        const chapters = bibleData[book];
        for (const chapter in chapters) {
            const verses = chapters[chapter];
            for (const verse in verses) {
                const verseText = verses[verse];
                const normalizedText = verseText.toLowerCase().replace(/[^\w\s]/g, '');
                const words = normalizedText.split(/\s+/).filter(w => w.length > 2);

                // Words and phrases
                words.forEach(word => {
                    if (!wordStats.has(word)) {
                        wordStats.set(word, { count: 0, books: new Set(), chapters: new Set(), verses: new Set(), ot: 0, nt: 0 });
                    }
                    const stats = wordStats.get(word);
                    stats.count++;
                    stats.books.add(book);
                    stats.chapters.add(`${book}:${chapter}`);
                    stats.verses.add(`${book}:${chapter}:${verse}`);
                    if (oldTestamentBooks.has(book)) stats.ot++;
                    else if (newTestamentBooks.has(book)) stats.nt++;
                });

                for (let i = 0; i < words.length - 1; i++) {
                    const phrase = `${words[i]} ${words[i + 1]}`;
                    if (!phraseStats.has(phrase)) {
                        phraseStats.set(phrase, { count: 0, books: new Set(), chapters: new Set(), verses: new Set(), ot: 0, nt: 0 });
                    }
                    const stats = phraseStats.get(phrase);
                    stats.count++;
                    stats.books.add(book);
                    stats.chapters.add(`${book}:${chapter}`);
                    stats.verses.add(`${book}:${chapter}:${verse}`);
                    if (oldTestamentBooks.has(book)) stats.ot++;
                    else if (newTestamentBooks.has(book)) stats.nt++;
                }

                // Capitalized words for locations
                const rawWords = verseText.split(/\s+/).filter(w => w.length > 2 && /^[A-Z]/.test(w) && !commonWords.has(w.toLowerCase()));
                rawWords.forEach(word => {
                    const normalized = word.toLowerCase().replace(/[^\w]/g, '');
                    if (!capitalizedWords.has(normalized)) {
                        capitalizedWords.set(normalized, { count: 0, books: new Set(), verses: new Set() });
                    }
                    const capStats = capitalizedWords.get(normalized);
                    capStats.count++;
                    capStats.books.add(book);
                    capStats.verses.add(`${book}:${chapter}:${verse}`);
                });
            }
        }
    }

    // Generate categories
    // Names from BibleData-PersonLabel.json only
    const names = new Set();
    personLabelData.forEach(entry => {
        const englishLabel = entry.english_label.toLowerCase().replace(/[^\w\s]/g, ''); // Normalize (e.g., "G-d" -> "gd")
        englishLabel.split(/\s+/).forEach(word => {
            if (word.length > 2) names.add(word); // Add individual words from multi-word labels
        });
    });

    // Locations: Capitalized words with location-like suffixes or high book diversity
    const locations = new Set();
    for (const [word, stats] of capitalizedWords) {
        const endsWithLocation = Array.from(locationSuffixes).some(suffix => word.endsWith(suffix));
        if ((endsWithLocation || stats.books.size > 3) && stats.count < 500 && !names.has(word)) {
            locations.add(word);
        }
    }

    // Religious Terms: High-frequency words with spiritual context
    const religiousSeed = new Set(['god', 'lord', 'spirit', 'sin', 'faith', 'grace']);
    const religiousTerms = new Set();
    for (const [word, stats] of wordStats) {
        if (stats.count > 50 && (religiousSeed.has(word) || wordStats.has(`${word} god`) || wordStats.has(`lord ${word}`))) {
            religiousTerms.add(word);
        }
    }

    // Positive/Negative Words: Sentiment-like classification
    const positiveSeed = new Set(['love', 'peace', 'joy']);
    const negativeSeed = new Set(['sin', 'evil', 'death']);
    const positiveWords = new Set();
    const negativeWords = new Set();
    for (const [word, stats] of wordStats) {
        if (stats.count > 20) {
            if (positiveSeed.has(word) || phraseStats.has(`${word} joy`) || phraseStats.has(`peace ${word}`)) {
                positiveWords.add(word);
            }
            if (negativeSeed.has(word) || phraseStats.has(`${word} evil`) || phraseStats.has(`death ${word}`)) {
                negativeWords.add(word);
            }
        }
    }

    return { wordStats, phraseStats, names, locations, religiousTerms, positiveWords, negativeWords, personLabelData };
}

// Process Bible data based on section type, testament, and book
function processBibleData(bibleData, stats, itemLimit, searchWord, section, testament, bookFilter) {
    const { wordStats, phraseStats, names, locations, religiousTerms, positiveWords, negativeWords } = stats;
    const searchTerm = searchWord ? searchWord.trim().toLowerCase() : null;

    let items = [];
    let totalItems = 0;
    const relevantStats = section === 'phrases' ? phraseStats : wordStats;

    if (searchTerm) {
        for (const [item, stat] of relevantStats) {
            let count = 0;
            let otCount = 0;
            let ntCount = 0;
            const books = new Set();
            const chapters = new Set();
            const verses = new Set();

            stat.verses.forEach(v => {
                const [book] = v.split(':');
                if ((testament === 'all' || (testament === 'old' && oldTestamentBooks.has(book)) || (testament === 'new' && newTestamentBooks.has(book))) &&
                    (bookFilter === 'all' || book === bookFilter)) {
                    verses.add(v);
                    chapters.add(v.substring(0, v.lastIndexOf(':')));
                    books.add(book);
                    count++;
                    if (oldTestamentBooks.has(book)) otCount++;
                    else if (newTestamentBooks.has(book)) ntCount++;
                }
            });

            if (section === 'phrases') {
                if (item.includes(searchTerm) && count > 0) {
                    items.push({ item: item, count, books, chapters, verses, otCount, ntCount });
                    totalItems += count;
                }
            } else {
                if (item === searchTerm && count > 0) {
                    items.push({ item: item, count, books, chapters, verses, otCount, ntCount });
                    totalItems += count;
                }
            }
        }
    } else {
        const filterStats = new Map();
        for (const [item, stat] of relevantStats) {
            let count = 0;
            let otCount = 0;
            let ntCount = 0;
            const books = new Set();
            const chapters = new Set();
            const verses = new Set();

            stat.verses.forEach(v => {
                const [book] = v.split(':');
                if ((testament === 'all' || (testament === 'old' && oldTestamentBooks.has(book)) || (testament === 'new' && newTestamentBooks.has(book))) &&
                    (bookFilter === 'all' || book === bookFilter)) {
                    verses.add(v);
                    chapters.add(v.substring(0, v.lastIndexOf(':')));
                    books.add(book);
                    count++;
                    if (oldTestamentBooks.has(book)) otCount++;
                    else if (newTestamentBooks.has(book)) ntCount++;
                }
            });

            if (count > 0) {
                filterStats.set(item, { count, books, chapters, verses, otCount, ntCount });
            }
        }

        if (section === 'phrases') {
            const relevantSets = [names, locations, religiousTerms, positiveWords, negativeWords];
            for (const [phrase, stat] of filterStats) {
                const phraseWords = phrase.split(' ');
                if (phraseWords.some(word => relevantSets.some(set => set.has(word)))) {
                    items.push({ item: phrase, ...stat });
                    totalItems += stat.count;
                }
            }
        } else {
            let filterSet;
            switch (section) {
                case 'words': filterSet = null; break;
                case 'names': filterSet = names; break;
                case 'locations': filterSet = locations; break;
                case 'phrases': filterSet = null; break;
                case 'terms': filterSet = religiousTerms; break;
                case 'positive': filterSet = positiveWords; break;
                case 'negative': filterSet = negativeWords; break;
            }
            for (const [word, stat] of filterStats) {
                if (!filterSet || filterSet.has(word)) {
                    items.push({ item: word, ...stat });
                    totalItems += stat.count;
                }
            }
        }
    }

    items.sort((a, b) => b.count - a.count);
    return {
        itemData: items.slice(0, itemLimit || 50),
        totalItems: totalItems
    };
}

// Fetch and process data with filters
async function fetchItemData(bibleData, stats, itemLimit, searchWord, section, testament, bookFilter) {
    return processBibleData(bibleData, stats, itemLimit, searchWord, section, testament, bookFilter);
}

// Display items
async function displayItems(bibleData, stats, section, testament, bookFilter) {
    const wordCloud = document.getElementById('word-cloud');
    const itemLimit = parseInt(document.getElementById('item-count').value) || 50;
    const searchWord = document.getElementById('search-word').value;

    try {
        const { itemData, totalItems } = await fetchItemData(bibleData, stats, itemLimit, searchWord, section, testament, bookFilter);
        window.itemData = itemData;
        window.stats = stats; // Store stats globally for popup access
        const maxCount = Math.max(...itemData.map(i => i.count), 1);

        wordCloud.innerHTML = "";
        if (itemData.length === 0) {
            wordCloud.innerHTML = `<div id="error-message">No results found for "${searchWord || section}".</div>`;
        } else {
            itemData.forEach(item => {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = item.item;
                const fontSize = (item.count / maxCount * 60) + 10;
                span.style.fontSize = `${fontSize}px`;
                span.addEventListener('click', () => showPopup(item, totalItems));
                wordCloud.appendChild(span);
            });
        }
    } catch (e) {
        console.error(e);
        wordCloud.innerHTML = `<div id="error-message">${e.message}</div>`;
    }
}

// Show popup with detailed stats and JSON data for names
function showPopup(item, totalItems) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('popup-title');
    const content = document.getElementById('popup-content');

    title.textContent = item.item;
    const totalBooks = oldTestamentBooks.size + newTestamentBooks.size;
    const otPercent = item.count > 0 ? (item.otCount / item.count * 100).toFixed(2) : 0;
    const ntPercent = item.count > 0 ? (item.ntCount / item.count * 100).toFixed(2) : 0;
    const avgPerBook = item.books.size > 0 ? (item.count / item.books.size).toFixed(2) : 0;

    let popupContent = `
        <strong>Occurrences:</strong> ${item.count} times<br>
        <strong>Percentage of Filtered Items:</strong> ${(item.count / totalItems * 100).toFixed(2)}%<br>
        <strong>Rank:</strong> ${window.itemData.findIndex(i => i.item === item.item) + 1}<br>
        <strong>Books Appeared In:</strong> ${item.books.size} (of ${totalBooks})<br>
        <strong>Chapters Appeared In:</strong> ${item.chapters.size}<br>
        <strong>Verses Appeared In:</strong> ${item.verses.size}<br>
        <strong>Old Testament:</strong> ${item.otCount} occurrences (${otPercent}%)<br>
        <strong>New Testament:</strong> ${item.ntCount} occurrences (${ntPercent}%)<br>
        <strong>Avg. Frequency per Book:</strong> ${avgPerBook} times/book
    `;

    // Add JSON data if the item is a name from BibleData-PersonLabel.json
    if (window.stats.names.has(item.item)) {
        const personEntries = window.stats.personLabelData.filter(entry => 
            entry.english_label.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).includes(item.item)
        );
        if (personEntries.length > 0) {
            popupContent += '<hr><strong>Person Label Data:</strong><ul>';
            personEntries.forEach(entry => {
                popupContent += `
                    <li>
                        <strong>ID:</strong> ${entry.person_label_id}<br>
                        <strong>English Label:</strong> ${entry.english_label}<br>
                        <strong>Hebrew Label:</strong> ${entry.hebrew_label} (${entry.hebrew_label_transliterated}) - ${entry.hebrew_label_meaning}<br>
                        <strong>Greek Label:</strong> ${entry.greek_label} (${entry.greek_label_transliterated}) - ${entry.greek_label_meaning}<br>
                        <strong>Reference:</strong> ${entry.label_reference_id}<br>
                        <strong>Type:</strong> ${entry.label_type}<br>
                        <strong>Given by God:</strong> ${entry['label-given_by_god']}<br>
                        <strong>Notes:</strong> ${entry.label_notes || 'None'}<br>
                        <strong>Count:</strong> ${entry.person_label_count}<br>
                        <strong>Sequence:</strong> ${entry.label_sequence}
                    </li>
                `;
            });
            popupContent += '</ul>';
        }
    }

    content.innerHTML = popupContent;
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

// Close popup
document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Populate book dropdown based on testament
function populateBookDropdown(testament) {
    const bookSelect = document.getElementById('book-select');
    bookSelect.innerHTML = '<option value="all">All Books</option>';
    if (testament === 'all') {
        bookSelect.disabled = true;
    } else {
        bookSelect.disabled = false;
        const books = testament === 'old' ? Array.from(oldTestamentBooks) : Array.from(newTestamentBooks);
        books.sort().forEach(book => {
            const option = document.createElement('option');
            option.value = book;
            option.textContent = book;
            bookSelect.appendChild(option);
        });
    }
}

// Toggle menu visibility
document.getElementById('toggle-controls-btn').addEventListener('click', () => {
    const menuDiv = document.getElementById('menu');
    const toggleBtn = document.getElementById('toggle-controls-btn');

    if (menuDiv.classList.contains('visible')) {
        menuDiv.classList.remove('visible');
        menuDiv.classList.add('hidden');
        toggleBtn.textContent = 'Show Menu';
    } else {
        menuDiv.classList.remove('hidden');
        menuDiv.classList.add('visible');
        toggleBtn.textContent = 'Hide Menu';
    }
});

// Initialize and set up tabs/filters
async function initialize() {
    const bibleData = await fetchBibleData();
    const personLabelData = await fetchPersonLabelData();
    const stats = await precomputeStats(bibleData, personLabelData);
    let currentSection = 'words';
    let currentTestament = 'all';
    let currentBook = 'all';

    populateBookDropdown(currentTestament);
    displayItems(bibleData, stats, currentSection, currentTestament, currentBook);

    const tabs = document.querySelectorAll('#tabs button');
    const advancedSection = document.getElementById('advanced-section');
    const advancedTabs = document.querySelectorAll('#advanced-tabs button');

    // Main Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.id.replace('tab-', '');
            if (tabId === 'advanced') {
                advancedSection.classList.remove('hidden');
                advancedSection.classList.add('visible');
                if (!document.querySelector('#advanced-tabs button.active')) {
                    document.getElementById('adv-tab-phrases').classList.add('active');
                    currentSection = 'phrases';
                }
            } else {
                advancedSection.classList.remove('visible');
                advancedSection.classList.add('hidden');
                advancedTabs.forEach(t => t.classList.remove('active'));
                currentSection = tabId;
            }
            displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
        });
    });

    // Advanced Tabs
    advancedTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            advancedTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSection = tab.id.replace('adv-tab-', '');
            displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
        });
    });

    document.getElementById('testament-select').addEventListener('change', (e) => {
        currentTestament = e.target.value;
        currentBook = 'all';
        populateBookDropdown(currentTestament);
        displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
    });

    document.getElementById('book-select').addEventListener('change', (e) => {
        currentBook = e.target.value;
        displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
    });

    document.getElementById('apply-filters').addEventListener('click', () => 
        displayItems(bibleData, stats, currentSection, currentTestament, currentBook));

    // Preset Filters Logic
    const presetFilters = {
        'salvation': { search: 'salvation', testament: 'all', book: 'all' },
        'faith': { search: 'faith', testament: 'all', book: 'all' },
        'creation': { search: 'creation', testament: 'old', book: 'Genesis' },
        'flood': { search: 'flood', testament: 'old', book: 'Genesis' },
        'patriarchs': { search: 'abraham', testament: 'old', book: 'Genesis' },
        'prophets': { search: 'isaiah', testament: 'old', book: 'Isaiah' },
        'holy-land': { search: 'jerusalem', testament: 'all', book: 'all' },
        'early-church': { search: 'church', testament: 'new', book: 'Acts' }
    };

    document.getElementById('preset-filters').addEventListener('change', (e) => {
        const preset = presetFilters[e.target.value];
        if (preset) {
            document.getElementById('search-word').value = preset.search;
            document.getElementById('testament-select').value = preset.testament;
            currentTestament = preset.testament;
            populateBookDropdown(currentTestament);
            document.getElementById('book-select').value = preset.book;
            currentBook = preset.book;
            displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
        }
    });
}

initialize();