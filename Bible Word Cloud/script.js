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

// Define Old and New Testament books in traditional Protestant canonical order
const oldTestamentBooks = new Set([
    // Pentateuch (Law)
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    // Historical Books
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", 
    "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther",
    // Wisdom/Poetry
    "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Songs",
    // Major Prophets
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
    // Minor Prophets (The Twelve)
    "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", 
    "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
]);

const newTestamentBooks = new Set([
    // Gospels
    "Matthew", "Mark", "Luke", "John",
    // History
    "Acts",
    // Pauline Epistles
    "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", 
    "1 Timothy", "2 Timothy", "Titus", "Philemon",
    // General Epistles
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude",
    // Apocalyptic
    "Revelation"
]);

// Precompute statistics for all words and phrases
async function precomputeStats(bibleData) {
    const wordStats = new Map();
    const phraseStats = new Map();

    for (const book in bibleData) {
        const chapters = bibleData[book];
        for (const chapter in chapters) {
            const verses = chapters[chapter];
            for (const verse in verses) {
                // Use RegExp constructor to avoid regex literal parsing issues
                const verseText = verses[verse].toLowerCase().replace(new RegExp('[^\\w\\s]', 'g'), '');
                const words = verseText.split(/\s+/).filter(w => w.length > 2);

                // Word stats
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

                // Phrase stats (two-word phrases)
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
            }
        }
    }

    return { wordStats, phraseStats };
}

// Process Bible data based on section type, testament, and book
function processBibleData(bibleData, stats, itemLimit, includeItems, excludeItems, section, testament, bookFilter) {
    // Split glossary into categories
    const names = new Set([
        "jesus", "moses", "abraham", "david", "solomon", "joseph", "mary", "paul", "peter", "john",
        "isaac", "jacob", "sarah", "noah", "samuel", "elijah", "elisha", "daniel", "jonah", "adam",
        "eve", "cain", "abel", "esau", "ruth", "esther", "job", "isaiah", "jeremiah", "ezekiel"
    ]);
    const locations = new Set([
        "jerusalem", "egypt", "israel", "judah", "babylon", "canaan", "bethlehem", "nazareth", "galilee",
        "samaria", "sinai", "jordan", "zion", "gilead", "moab", "edom", "philistia", "syria", "assyria",
        "persia", "gaza", "hebron", "damascus", "capernaum", "bethel", "joppa", "tyre", "sidon"
    ]);
    const religiousTerms = new Set([
        "god", "lord", "spirit", "covenant", "sin", "grace", "faith", "salvation", "kingdom", "heaven",
        "hell", "priest", "prophet", "king", "temple", "altar", "sacrifice", "law", "mercy", "judgment",
        "peace", "love", "hope", "truth", "righteousness", "blessing", "curse", "sabbath", "church"
    ]);

    // Custom filters
    const includeSet = includeItems ? new Set(includeItems.split(',').map(i => i.trim().toLowerCase())) : null;
    const excludeSet = excludeItems ? new Set(excludeItems.split(',').map(i => i.trim().toLowerCase())) : new Set();

    let items = [];
    let totalItems = 0;
    const relevantStats = section === 'phrases' ? stats.phraseStats : stats.wordStats;

    // Filter by testament and book
    const filterStats = new Map();
    for (const [item, stat] of relevantStats) {
        let count = 0;
        let otCount = 0;
        let ntCount = 0;
        const books = new Set();
        const chapters = new Set();
        const verses = new Set();

        if (testament === 'all' && bookFilter === 'all') {
            count = stat.count;
            otCount = stat.ot;
            ntCount = stat.nt;
            stat.books.forEach(b => books.add(b));
            stat.chapters.forEach(c => chapters.add(c));
            stat.verses.forEach(v => verses.add(v));
        } else {
            const bookSet = testament === 'old' ? oldTestamentBooks : newTestamentBooks;
            stat.verses.forEach(v => {
                const [book] = v.split(':');
                if (bookSet.has(book) && (bookFilter === 'all' || book === bookFilter)) {
                    verses.add(v);
                    chapters.add(v.substring(0, v.lastIndexOf(':')));
                    books.add(book);
                    count++;
                    if (oldTestamentBooks.has(book)) otCount++;
                    else if (newTestamentBooks.has(book)) ntCount++;
                }
            });
        }

        if (count > 0) {
            filterStats.set(item, { count, books, chapters, verses, otCount, ntCount });
        }
    }

    if (section === 'phrases') {
        const relevantSets = [names, locations, religiousTerms];
        for (const [phrase, stat] of filterStats) {
            const phraseWords = phrase.split(' ');
            if (phraseWords.some(word => relevantSets.some(set => set.has(word))) || (includeSet && includeSet.has(phrase))) {
                if (!excludeSet.has(phrase)) {
                    items.push({ item: phrase, ...stat });
                    totalItems += stat.count;
                }
            }
        }
    } else {
        let filterSet;
        switch (section) {
            case 'words': filterSet = null; break;
            case 'names': filterSet = names; break;
            case 'locations': filterSet = locations; break;
            case 'terms': filterSet = religiousTerms; break;
        }
        for (const [word, stat] of filterStats) {
            if ((!filterSet || filterSet.has(word) || (includeSet && includeSet.has(word))) && !excludeSet.has(word)) {
                items.push({ item: word, ...stat });
                totalItems += stat.count;
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
async function fetchItemData(bibleData, stats, itemLimit, includeItems, excludeItems, section, testament, bookFilter) {
    return processBibleData(bibleData, stats, itemLimit, includeItems, excludeItems, section, testament, bookFilter);
}

// Display items
async function displayItems(bibleData, stats, section, testament, bookFilter) {
    const wordCloud = document.getElementById('word-cloud');
    const itemLimit = parseInt(document.getElementById('item-count').value) || 50;
    const includeItems = document.getElementById('include-items').value;
    const excludeItems = document.getElementById('exclude-items').value;

    try {
        const { itemData, totalItems } = await fetchItemData(bibleData, stats, itemLimit, includeItems, excludeItems, section, testament, bookFilter);
        window.itemData = itemData; // Store globally for popup access
        const maxCount = Math.max(...itemData.map(i => i.count));

        wordCloud.innerHTML = ""; // Clear previous content
        itemData.forEach(item => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = item.item;
            const fontSize = (item.count / maxCount * 60) + 10;
            span.style.fontSize = `${fontSize}px`;
            span.addEventListener('click', () => showPopup(item, totalItems));
            wordCloud.appendChild(span);
        });
    } catch (e) {
        console.error(e);
        wordCloud.innerHTML = `<div id="error-message">${e.message}</div>`;
    }
}

// Show popup with detailed stats
function showPopup(item, totalItems) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('popup-title');
    const content = document.getElementById('popup-content');

    title.textContent = item.item;
    const totalBooks = oldTestamentBooks.size + newTestamentBooks.size;
    const otPercent = item.otCount + item.ntCount > 0 ? (item.otCount / (item.otCount + item.ntCount) * 100).toFixed(2) : 0;
    const ntPercent = item.otCount + item.ntCount > 0 ? (item.ntCount / (item.otCount + item.ntCount) * 100).toFixed(2) : 0;
    const avgPerBook = item.books.size > 0 ? (item.count / item.books.size).toFixed(2) : 0;

    content.innerHTML = `
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

// Toggle filters and tabs visibility
document.getElementById('toggle-controls-btn').addEventListener('click', () => {
    const filtersDiv = document.getElementById('filters');
    const tabsDiv = document.getElementById('tabs');
    const toggleBtn = document.getElementById('toggle-controls-btn');

    if (filtersDiv.classList.contains('visible')) {
        filtersDiv.classList.remove('visible');
        filtersDiv.classList.add('hidden');
        tabsDiv.classList.remove('visible');
        tabsDiv.classList.add('hidden');
        toggleBtn.textContent = 'Show Filters & Tabs';
    } else {
        filtersDiv.classList.remove('hidden');
        filtersDiv.classList.add('visible');
        tabsDiv.classList.remove('hidden');
        tabsDiv.classList.add('visible');
        toggleBtn.textContent = 'Hide Filters & Tabs';
    }
});

// Initialize and set up tabs/filters
async function initialize() {
    const bibleData = await fetchBibleData();
    const stats = await precomputeStats(bibleData);
    let currentSection = 'words';
    let currentTestament = 'all';
    let currentBook = 'all';

    // Initial display
    populateBookDropdown(currentTestament);
    displayItems(bibleData, stats, currentSection, currentTestament, currentBook);

    // Tab switching
    const tabs = document.querySelectorAll('#tabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSection = tab.id.replace('tab-', '');
            displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
        });
    });

    // Testament filter
    document.getElementById('testament-select').addEventListener('change', (e) => {
        currentTestament = e.target.value;
        currentBook = 'all'; // Reset book when testament changes
        populateBookDropdown(currentTestament);
        displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
    });

    // Book filter
    document.getElementById('book-select').addEventListener('change', (e) => {
        currentBook = e.target.value;
        displayItems(bibleData, stats, currentSection, currentTestament, currentBook);
    });

    // Apply filters
    document.getElementById('apply-filters').addEventListener('click', () => displayItems(bibleData, stats, currentSection, currentTestament, currentBook));
}

initialize();
