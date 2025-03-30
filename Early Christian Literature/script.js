const works = [
    //1st century
    {"title": "James", "author": "James (brother of Jesus)", "year": 90, "description": "An epistle addressing practical Christian living and perseverance.", "category": "Scripture", "period": "1st Century", "location": "Jerusalem", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Galatians", "author": "Paul", "year": 48, "description": "An epistle defending justification by faith against legalism.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "1 Thessalonians", "author": "Paul", "year": 50, "description": "An epistle encouraging steadfastness and addressing the Second Coming.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "2 Thessalonians", "author": "Paul", "year": 51, "description": "A follow-up epistle clarifying eschatological teachings.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "1 Corinthians", "author": "Paul", "year": 55, "description": "An epistle addressing church divisions and moral issues.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Romans", "author": "Paul", "year": 56, "description": "A theological treatise on salvation and righteousness.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "2 Corinthians", "author": "Paul", "year": 57, "description": "A defense of Paul’s apostolic authority and ministry.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Ephesians", "author": "Paul", "year": 75, "description": "An epistle on the church as the body of Christ.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "Philippians", "author": "Paul", "year": 60, "description": "An epistle of joy and encouragement from prison.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Colossians", "author": "Paul", "year": 60, "description": "An epistle refuting false teachings and exalting Christ.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "Philemon", "author": "Paul", "year": 60, "description": "A personal letter advocating for a runaway slave.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "1 Peter", "author": "Peter", "year": 65, "description": "An epistle encouraging perseverance under persecution.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "1 Timothy", "author": "Paul", "year": 95, "description": "Instructions for church leadership and doctrine.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "Titus", "author": "Paul", "year": 95, "description": "Guidance for church organization in Crete.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "2 Peter", "author": "Peter", "year": 125, "description": "A warning against false teachers and affirmation of scripture.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Disputed"},
    {"title": "Mark", "author": "Mark (John Mark)", "year": 65, "description": "A concise gospel focusing on Jesus’ actions and ministry.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "2 Timothy", "author": "Paul", "year": 66, "description": "Paul’s final epistle, urging perseverance in ministry.", "category": "Scripture", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "Jude", "author": "Jude (brother of James)", "year": 70, "description": "A short epistle warning against false teachers.", "category": "Scripture", "period": "1st Century", "location": "Unknown", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Matthew", "author": "Matthew (Levi)", "year": 75, "description": "A gospel linking Jesus to Old Testament prophecies.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Luke", "author": "Luke", "year": 80, "description": "A detailed gospel emphasizing Jesus’ compassion.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Acts of the Apostles", "author": "Luke", "year": 80, "description": "A history of the early church and the spread of the gospel.", "category": "Scripture", "period": "1st Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Hebrews", "author": "Anonymous", "year": 60, "description": "An epistle emphasizing Christ’s priesthood, authorship debated.", "category": "Scripture", "period": "1st Century", "location": "Unknown", "Heretical": "no", "GenuineRating": "Fair"},
    {"title": "John", "author": "John (son of Zebedee)", "year": 90, "description": "A theological gospel emphasizing Jesus’ divinity.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "1 John", "author": "John (son of Zebedee)", "year": 90, "description": "An epistle on love, truth, and assurance of salvation.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "2 John", "author": "John (son of Zebedee)", "year": 90, "description": "A brief letter warning against false teachers.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "3 John", "author": "John (son of Zebedee)", "year": 100, "description": "A personal letter supporting faithful ministry.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Revelation", "author": "John (son of Zebedee)", "year": 95, "description": "An apocalyptic vision of the end times.", "category": "Scripture", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Gospel of Thomas", "author": "Anonymous", "year": 70, "description": "A collection of sayings attributed to Jesus, often linked to Gnostic traditions.", "category": "Theology", "period": "1st Century", "location": "Egypt", "Heretical": "yes", "GenuineRating": "Forgery"},
    {"title": "The Didache", "author": "Anonymous", "year": 70, "description": "An early Christian treatise outlining ethical teachings, rituals, and church organization.", "category": "Liturgy", "period": "1st Century", "location": "Syria", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Epistle of Barnabas", "author": "Anonymous", "year": 70, "description": "A theological treatise emphasizing the fulfillment of Old Testament prophecies in Christ.", "category": "Theology", "period": "1st Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Forgery"},
    {"title": "First Epistle of Clement", "author": "Clement of Rome", "year": 80, "description": "A letter addressing divisions in the Corinthian church, emphasizing unity and order.", "category": "Epistles", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Shepherd of Hermas", "author": "Hermas", "year": 100, "description": "A Christian literary work with visions, commandments, and parables, focusing on repentance.", "category": "Theology", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Second Epistle of Clement", "author": "Anonymous (attributed to Clement)", "year": 95, "description": "A sermon on repentance and Christian living, often considered the earliest Christian homily.", "category": "Homilies", "period": "1st Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Forgery"},
    {"title": "Expositions of the Sayings of the Lord", "author": "Papias of Hierapolis", "year": 110, "description": "A collection of Jesus’ sayings and traditions, now mostly lost; cited by Eusebius.", "category": "Theology", "period": "1st Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    //2nd century
    {"title": "The Odes of Solomon", "author": "Anonymous", "year": 100, "description": "A collection of early Christian hymns, expressing themes of praise and divine love.", "category": "Liturgy", "period": "2nd Century", "location": "Syria", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Letters of Ignatius of Antioch", "author": "Ignatius of Antioch", "year": 105, "description": "Seven letters written to churches, emphasizing unity, martyrdom, and church authority.", "category": "Epistles", "period": "2nd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Epistle of Polycarp to the Philippians", "author": "Polycarp", "year": 105, "description": "A letter encouraging steadfastness in faith and addressing church issues.", "category": "Epistles", "period": "2nd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Pliny the Younger (Epistles 10.96)", "author": "Pliny the Younger", "year": 110, "description": "A Roman governor’s letter describing early Christian worship practices.", "category": "Historical", "period": "2nd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Preaching of Peter", "author": "Anonymous (attributed to Peter)", "year": 110, "description": "An early apologetic and evangelistic text, now fragmentary; cited by Eusebius.", "category": "Apologies", "period": "2nd Century", "location": "Unknown", "Heretical": "no", "GenuineRating": "Forgery"},
    {"title": "Fragments of Quadratus", "author": "Quadratus of Athens", "year": 120, "description": "One of the earliest Christian apologies, defending the faith; cited by Eusebius.", "category": "Apologies", "period": "2nd Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Apology of Aristides", "author": "Aristides of Athens", "year": 120, "description": "An apologetic work addressed to Emperor Hadrian, defending Christian beliefs.", "category": "Apologies", "period": "2nd Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Gospel of Peter", "author": "Anonymous (attributed to Peter)", "year": 120, "description": "A non-canonical gospel narrating Christ’s Passion and Resurrection.", "category": "Apocrypha", "period": "2nd Century", "location": "Syria", "Heretical": "yes", "GenuineRating": "Forgery"},
    {"title": "The Epistle to Diognetus", "author": "Anonymous", "year": 130, "description": "A letter explaining Christian beliefs to a pagan audience.", "category": "Apologies", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Dialogue with Trypho", "author": "Justin Martyr", "year": 135, "description": "A theological debate with a Jewish scholar, exploring Christ’s fulfillment of prophecy.", "category": "Theology", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "First Apology", "author": "Justin Martyr", "year": 150, "description": "A defense of Christianity addressed to the Roman emperor.", "category": "Apologies", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Second Apology", "author": "Justin Martyr", "year": 150, "description": "A shorter work addressing accusations against Christians.", "category": "Apologies", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Diatessaron", "author": "Tatian", "year": 170, "description": "A harmony of the four Gospels into a single narrative.", "category": "Apocrypha", "period": "2nd Century", "location": "Syria", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Fragments of Tatian", "author": "Tatian", "year": 150, "description": "Includes *Address to the Greeks*, an apologetic work.", "category": "Apologies", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Martyrdom of Polycarp", "author": "Anonymous", "year": 155, "description": "An account of Polycarp’s arrest, trial, and execution.", "category": "Martyrdom", "period": "2nd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Fragments of Hegesippus", "author": "Hegesippus", "year": 160, "description": "A historical account of early Christianity, focusing on heresies; cited by Eusebius.", "category": "Historical", "period": "2nd Century", "location": "Jerusalem", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Fragments of Melito of Sardis", "author": "Melito of Sardis", "year": 160, "description": "Includes *On Pascha*, exploring the theological significance of Easter.", "category": "Theology", "period": "2nd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Fragments of Athenagoras", "author": "Athenagoras", "year": 170, "description": "Includes *A Plea for the Christians* and *On the Resurrection*.", "category": "Apologies", "period": "2nd Century", "location": "Greece", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Acts of Paul and Thecla", "author": "Anonymous", "year": 170, "description": "A narrative of Paul’s companion Thecla, emphasizing asceticism.", "category": "Martyrdom", "period": "2nd Century", "location": "Asia Minor", "Heretical": "yes", "GenuineRating": "Forgery"},
    {"title": "Against Heresies (Adversus Haereses)", "author": "Irenaeus of Lyons", "year": 175, "description": "A refutation of Gnosticism, defending orthodox teachings.", "category": "Theology", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Demonstration of the Apostolic Preaching", "author": "Irenaeus of Lyons", "year": 175, "description": "A summary of Christian doctrine, emphasizing the unity of Testaments.", "category": "Theology", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Muratorian Fragment", "author": "Anonymous", "year": 180, "description": "An early list of New Testament canon.", "category": "Historical", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Exhortation to the Greeks", "author": "Clement of Alexandria", "year": 180, "description": "An apologetic work encouraging pagans to embrace Christianity.", "category": "Apologies", "period": "2nd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Instructor (Paedagogus)", "author": "Clement of Alexandria", "year": 185, "description": "A guide to Christian ethics and daily living.", "category": "Theology", "period": "2nd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Stromata", "author": "Clement of Alexandria", "year": 190, "description": "Miscellaneous writings exploring theology and philosophy.", "category": "Theology", "period": "2nd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Apology", "author": "Tertullian", "year": 190, "description": "A defense of Christianity against Roman accusations.", "category": "Apologies", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "On Prayer", "author": "Tertullian", "year": 190, "description": "A guide to Christian prayer.", "category": "Theology", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "On Christ and Antichrist", "author": "Hippolytus of Rome", "year": 190, "description": "A theological exploration of Christ and the Antichrist.", "category": "Theology", "period": "2nd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    //3rd century
    {"title": "To Scapula", "author": "Tertullian", "year": 200, "description": "A letter arguing against persecution of Christians.", "category": "Apologies", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Apostolic Tradition", "author": "Hippolytus of Rome", "year": 200, "description": "A manual of church order and liturgy.", "category": "Liturgy", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Octavius", "author": "Marcus Minucius Felix", "year": 200, "description": "An apologetic dialogue defending Christianity.", "category": "Apologies", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "The Passion of Perpetua and Felicity", "author": "Anonymous", "year": 202, "description": "An account of the martyrdom of Perpetua and Felicity.", "category": "Martyrdom", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "On First Principles (De Principiis)", "author": "Origen", "year": 210, "description": "A theological work exploring Christian doctrine.", "category": "Theology", "period": "3rd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Refutation of All Heresies", "author": "Hippolytus of Rome", "year": 210, "description": "A critique of heresies, defending orthodox teachings.", "category": "Theology", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Homilies", "author": "Origen", "year": 215, "description": "Sermons on biblical books.", "category": "Homilies", "period": "3rd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Commentary on John", "author": "Origen", "year": 215, "description": "An exegetical work on the Gospel of John.", "category": "Theology", "period": "3rd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Commentary on Matthew", "author": "Origen", "year": 220, "description": "A commentary on the Gospel of Matthew.", "category": "Theology", "period": "3rd Century", "location": "Egypt", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Against Celsus", "author": "Origen", "year": 225, "description": "A refutation of Celsus’ criticisms of Christianity.", "category": "Apologies", "period": "3rd Century", "location": "Asia Minor", "Heretical": "no", "GenuineRating": "Genuine"},
    {"title": "Letters of Cyprian", "author": "Cyprian of Carthage", "year": 250, "description": "Epistles addressing church discipline and martyrdom.", "category": "Epistles", "period": "3rd Century", "location": "Rome", "Heretical": "no", "GenuineRating": "Genuine"},
    //4th century
    
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timeline = document.getElementById('timeline');
    const timelineContainer = document.getElementById('timelineContainer');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');
    const popupInfo = document.getElementById('popupInfo');
    const closePopup = document.getElementById('closePopup');
    const centuryFilter = document.getElementById('centuryFilter');
    const authorFilter = document.getElementById('authorFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const hereticalFilter = document.getElementById('hereticalFilter');
    const locationFilter = document.getElementById('locationFilter');
    const genuineFilter = document.getElementById('genuineFilter');
    const applyFilterButton = document.getElementById('applyFilter'); // Ensure ID matches HTML

    const categoryColors = {
        "Scripture": "#858d6f",
        "Apocrypha": "#2a5678",
        "Epistles": "#3d8299",
        "Liturgy": "#2a5678",
        "Theology": "#5ea1b8",
        "Homilies": "#123a50",
        "Martyrdom": "#346b87",
        "Historical": "#4a8ca3",
        "Apologies": "#76b7cc"
    };

    // Timeline constants
    let baseTimelineWidth = 3000;
    const minYear = Math.min(...works.map(w => w.year));
    const maxYear = Math.max(...works.map(w => w.year));
    const yearRange = maxYear - minYear;
    let zoomLevel = 1;
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.25;

    // Populate filter options
    function populateFilter(selectElement, values, defaultLabel) {
        selectElement.innerHTML = '';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "all";
        defaultOpt.textContent = defaultLabel;
        selectElement.appendChild(defaultOpt);
        
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    // Initialize filters
    function initializeFilters() {
        populateFilter(authorFilter, [...new Set(works.map(work => work.author))].sort(), "All Authors");
        populateFilter(categoryFilter, [...new Set(works.map(work => work.category))].sort(), "All Categories");
        populateFilter(locationFilter, [...new Set(works.map(work => work.location))].sort(), "All Locations");
        populateFilter(genuineFilter, ["Genuine", "Fair", "Forgery", "Disputed"], "All Ratings");
    }

    // Render timeline
    function renderTimeline(filteredWorks) {
        while (timeline.children.length > 1) {
            timeline.removeChild(timeline.lastChild);
        }

        timeline.style.width = `${baseTimelineWidth * zoomLevel}px`;
        const currentTimelineWidth = baseTimelineWidth * zoomLevel;

        if (filteredWorks.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = 'No works match the current filters';
            noResults.style.position = 'absolute';
            noResults.style.left = '50%';
            noResults.style.top = '50%';
            noResults.style.transform = 'translate(-50%, -50%)';
            noResults.style.color = '#666';
            timeline.appendChild(noResults);
            return;
        }

        const positionMap = new Map();

        filteredWorks.forEach(work => {
            const position = 30 + ((work.year - minYear) / yearRange) * (currentTimelineWidth - 60);
            const point = document.createElement('div');
            point.className = 'timeline-point';
            point.style.left = `${position}px`;
            point.style.backgroundColor = categoryColors[work.category] || '#1a3c5e';
            point.innerHTML = `<span>${work.year}</span>`;
            point.setAttribute('data-info', JSON.stringify(work));

            let verticalOffset = 0;
            if (positionMap.has(Math.round(position))) {
                const offsets = positionMap.get(Math.round(position));
                verticalOffset = offsets.length * 30;
                offsets.push(verticalOffset);
            } else {
                positionMap.set(Math.round(position), [0]);
            }
            point.style.top = `calc(50% - ${verticalOffset}px)`;

            point.addEventListener('mouseenter', () => {
                const span = point.querySelector('span');
                span.textContent = work.title.length > 20 ? `${work.title.substring(0, 17)}...` : work.title;
            });
            point.addEventListener('mouseleave', () => {
                const span = point.querySelector('span');
                span.textContent = work.year;
            });

            point.addEventListener('click', (e) => {
                e.stopPropagation();
                showPopup(work);
            });

            timeline.appendChild(point);
        });
    }

    // Show popup
    function showPopup(work) {
        popupTitle.textContent = work.title;
        popupInfo.innerHTML = `
            <p><strong>Author:</strong> ${work.author}</p>
            <p><strong>Year:</strong> ${work.year} AD</p>
            <p><strong>Category:</strong> ${work.category}</p>
            <p><strong>Location:</strong> ${work.location}</p>
            <p><strong>Heretical:</strong> ${work.Heretical === "yes" ? "Yes" : "No"}</p>
            <p><strong>Authenticity:</strong> ${work.GenuineRating ? work.GenuineRating.charAt(0).toUpperCase() + work.GenuineRating.slice(1) : "Unknown"}</p>
            <p><strong>Description:</strong> ${work.description}</p>
        `;
        overlay.style.display = 'block';
        popup.style.display = 'block';
    }

    // Apply filters
    function applyFilters() {
        const filteredWorks = applyFiltersAndGetWorks();
        renderTimeline(filteredWorks);
    }

    // Zoom functions
    function zoomIn() {
        if (zoomLevel < maxZoom) {
            zoomLevel += zoomStep;
            renderTimeline(applyFiltersAndGetWorks());
        }
    }

    function zoomOut() {
        if (zoomLevel > minZoom) {
            zoomLevel -= zoomStep;
            renderTimeline(applyFiltersAndGetWorks());
        }
    }

    // Helper function for filters
    function applyFiltersAndGetWorks() {
        const selectedCentury = centuryFilter.value;
        const selectedAuthor = authorFilter.value;
        const selectedCategory = categoryFilter.value;
        const selectedHeretical = hereticalFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedGenuine = genuineFilter.value;

        let filteredWorks = [...works];

        if (selectedCentury !== 'all') {
            const centuryNum = parseInt(selectedCentury);
            filteredWorks = filteredWorks.filter(work => {
                const workCentury = Math.floor(work.year / 100) + 1;
                return workCentury === centuryNum;
            });
        }

        if (selectedAuthor !== 'all') filteredWorks = filteredWorks.filter(work => work.author === selectedAuthor);
        if (selectedCategory !== 'all') filteredWorks = filteredWorks.filter(work => work.category === selectedCategory);
        if (selectedHeretical !== 'all') filteredWorks = filteredWorks.filter(work => work.Heretical === selectedHeretical);
        if (selectedLocation !== 'all') filteredWorks = filteredWorks.filter(work => work.location === selectedLocation);
        if (selectedGenuine !== 'all') filteredWorks = filteredWorks.filter(work => work.GenuineRating === selectedGenuine);

        return filteredWorks;
    }

    // Event listeners
    applyFilterButton.addEventListener('click', applyFilters);
    closePopup.addEventListener('click', () => {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    });
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    });
    zoomInButton.addEventListener('click', zoomIn);
    zoomOutButton.addEventListener('click', zoomOut);

    // Drag functionality
    let isDragging = false;
    let startX;
    let scrollLeft;

    timelineContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - timelineContainer.offsetLeft;
        scrollLeft = timelineContainer.scrollLeft;
    });

    timelineContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    timelineContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    timelineContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - timelineContainer.offsetLeft;
        const walk = (x - startX) * 2;
        timelineContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    timelineContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - timelineContainer.offsetLeft;
        scrollLeft = timelineContainer.scrollLeft;
    });

    timelineContainer.addEventListener('touchend', () => {
        isDragging = false;
    });

    timelineContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - timelineContainer.offsetLeft;
        const walk = (x - startX) * 2;
        timelineContainer.scrollLeft = scrollLeft - walk;
    });

    // Initialize
    initializeFilters();
    renderTimeline(works);
});