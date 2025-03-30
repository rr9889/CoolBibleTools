const timeline = document.getElementById('timeline');
        const timelineContainer = document.getElementById('timelineContainer');
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popupTitle');
        const popupInfo = document.getElementById('popupInfo');
        const closePopup = document.getElementById('closePopup');
        const centuryFilter = document.getElementById('centuryFilter');
        const authorFilter = document.getElementById('authorFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const applyFilterButton = document.getElementById('applyFilter');

        // Category colors
        const categoryColors = {
            "Scripture": "#1a3c5e",
            "Epistles": "#3d8299",
            "Liturgy": "#2a5678",
            "Theology": "#5ea1b8",
            "Homilies": "#123a50",
            "Martyrdom": "#346b87",
            "Historical": "#4a8ca3",
            "Apologies": "#76b7cc"
        };

        // Populate filter options
        function populateFilter(selectElement, values) {
            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectElement.appendChild(option);
            });
        }

        // Fetch JSON data and initialize
        fetch('./christianworks.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(works => {
                // Populate filters with data
                const authors = [...new Set(works.map(work => work.author))].sort();
                populateFilter(authorFilter, authors);

                const categories = [...new Set(works.map(work => work.category))].sort();
                populateFilter(categoryFilter, categories);

                // Timeline range based on data
                const minYear = Math.min(...works.map(work => work.year));
                const maxYear = Math.max(...works.map(work => work.year));
                const timelineWidth = 1540;
                const yearRange = maxYear - minYear;

                // Function to render timeline
                function renderTimeline(filteredWorks) {
                    while (timeline.children.length > 1) {
                        timeline.removeChild(timeline.lastChild);
                    }

                    filteredWorks.forEach(work => {
                        const position = 30 + ((work.year - minYear) / yearRange) * timelineWidth;
                        const point = document.createElement('div');
                        point.className = 'timeline-point';
                        point.style.left = `${position}px`;
                        point.style.backgroundColor = categoryColors[work.category] || '#1a3c5e';
                        point.innerHTML = `<span>${work.year}</span>`;
                        point.setAttribute('data-info', JSON.stringify(work));

                        point.addEventListener('mouseenter', () => {
                            const span = point.querySelector('span');
                            span.textContent = work.title;
                        });
                        point.addEventListener('mouseleave', () => {
                            const span = point.querySelector('span');
                            span.textContent = work.year;
                        });

                        timeline.appendChild(point);
                    });

                    const timelinePoints = document.querySelectorAll('.timeline-point');
                    timelinePoints.forEach(point => {
                        point.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const work = JSON.parse(point.getAttribute('data-info'));
                            popupTitle.textContent = work.title;
                            popupInfo.innerHTML = `
                                <p><strong>Author:</strong> ${work.author}</p>
                                <p><strong>Year:</strong> ${work.year} AD</p>
                                <p><strong>Category:</strong> ${work.category}</p>
                                <p><strong>Location:</strong> ${work.location}</p>
                                <p><strong>Description:</strong> ${work.description}</p>
                            `;
                            overlay.style.display = 'block';
                            popup.style.display = 'block';
                        });
                    });
                }

                // Initial render
                renderTimeline(works);

                // Filter logic
                applyFilterButton.addEventListener('click', () => {
                    const selectedCentury = centuryFilter.value;
                    const selectedAuthor = authorFilter.value;
                    const selectedCategory = categoryFilter.value;

                    let filteredWorks = [...works];

                    if (selectedCentury !== 'all') {
                        const centuryStart = (parseInt(selectedCentury) - 1) * 100;
                        const centuryEnd = centuryStart + 99;
                        filteredWorks = filteredWorks.filter(work => 
                            work.year >= centuryStart && work.year <= centuryEnd
                        );
                    }

                    if (selectedAuthor !== 'all') {
                        filteredWorks = filteredWorks.filter(work => 
                            work.author === selectedAuthor
                        );
                    }

                    if (selectedCategory !== 'all') {
                        filteredWorks = filteredWorks.filter(work => 
                            work.category === selectedCategory
                        );
                    }

                    console.log('Filtered Works:', filteredWorks); // Debugging
                    renderTimeline(filteredWorks);
                });

                // Popup close functionality
                closePopup.addEventListener('click', () => {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                });

                overlay.addEventListener('click', () => {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                });

                // Drag functionality for timeline
                let isDragging = false;
                let startX;
                let scrollLeft;

                timelineContainer.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.pageX - timelineContainer.offsetLeft;
                    scrollLeft = timelineContainer.scrollLeft;
                    timelineContainer.style.cursor = 'grabbing';
                });

                timelineContainer.addEventListener('mouseleave', () => {
                    isDragging = false;
                    timelineContainer.style.cursor = 'grab';
                });

                timelineContainer.addEventListener('mouseup', () => {
                    isDragging = false;
                    timelineContainer.style.cursor = 'grab';
                });

                timelineContainer.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    const x = e.pageX - timelineContainer.offsetLeft;
                    const walk = (x - startX) * 2;
                    timelineContainer.scrollLeft = scrollLeft - walk;
                });

                // Touch support for mobile
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
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                document.body.innerHTML += '<p>Error loading data. Please check the console.</p>';
            });