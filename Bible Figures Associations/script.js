       // Hard-coded JSON data
       const peopleData = [
        {
            "id": "1",
            "Name": "Deborah",
            "ImageURL": "",
            "Scriptural References": ["Judges 4-5"],
            "Region of Association": "Israel",
            "Occupation": "Judge and Prophetess",
            "Importance": "The only female judge of Israel who led her people to victory against oppression.",
            "Connections": ["2", "3"]
        },
        {
            "id": "2",
            "Name": "Barak",
            "ImageURL": "",
            "Scriptural References": ["Judges 4-5"],
            "Region of Association": "Israel",
            "Occupation": "Military Commander",
            "Importance": "Led the army of Israel under Deborah's direction.",
            "Connections": ["1", "3"]
        },
        {
            "id": "3",
            "Name": "Jael",
            "ImageURL": "",
            "Scriptural References": ["Judges 4-5"],
            "Region of Association": "Israel",
            "Occupation": "Housewife",
            "Importance": "Killed Sisera, the enemy commander, with a tent peg.",
            "Connections": ["1", "2"]
        },
        {
            "id": "4",
            "Name": "Moses",
            "ImageURL": "",
            "Scriptural References": ["Exodus, Leviticus, Numbers, Deuteronomy"],
            "Region of Association": "Egypt/Israel",
            "Occupation": "Prophet and Leader",
            "Importance": "Led the Israelites out of Egypt and received the Ten Commandments.",
            "Connections": ["5", "6", "7"]
        },
        {
            "id": "5",
            "Name": "Aaron",
            "ImageURL": "",
            "Scriptural References": ["Exodus, Leviticus, Numbers"],
            "Region of Association": "Egypt/Israel",
            "Occupation": "First High Priest",
            "Importance": "Brother of Moses who served as spokesperson and first high priest of Israel.",
            "Connections": ["4", "6"]
        },
        {
            "id": "6",
            "Name": "Miriam",
            "ImageURL": "",
            "Scriptural References": ["Exodus 15, Numbers 12"],
            "Region of Association": "Egypt/Israel",
            "Occupation": "Prophetess",
            "Importance": "Sister of Moses and Aaron who led women in worship after crossing the Red Sea.",
            "Connections": ["4", "5"]
        },
        {
            "id": "7",
            "Name": "Joshua",
            "ImageURL": "",
            "Scriptural References": ["Exodus, Numbers, Joshua"],
            "Region of Association": "Israel/Canaan",
            "Occupation": "Military Leader",
            "Importance": "Successor to Moses who led the conquest of Canaan.",
            "Connections": ["4", "8"]
        },
        {
            "id": "8",
            "Name": "Caleb",
            "ImageURL": "",
            "Scriptural References": ["Numbers, Joshua"],
            "Region of Association": "Israel/Canaan",
            "Occupation": "Spy/Tribal Leader",
            "Importance": "One of the twelve spies who remained faithful to God's promise.",
            "Connections": ["7"]
        },
        {
            "id": "9",
            "Name": "David",
            "ImageURL": "",
            "Scriptural References": ["1 & 2 Samuel, 1 Kings, Psalms"],
            "Region of Association": "Israel",
            "Occupation": "King and Psalmist",
            "Importance": "Second king of Israel, known as a man after God's own heart.",
            "Connections": ["10", "11", "12"]
        },
        {
            "id": "10",
            "Name": "Jonathan",
            "ImageURL": "",
            "Scriptural References": ["1 Samuel"],
            "Region of Association": "Israel",
            "Occupation": "Prince",
            "Importance": "Son of Saul who formed a covenant friendship with David.",
            "Connections": ["9", "11"]
        },
        {
            "id": "11",
            "Name": "Saul",
            "ImageURL": "",
            "Scriptural References": ["1 Samuel"],
            "Region of Association": "Israel",
            "Occupation": "First King of Israel",
            "Importance": "First king of Israel who was later rejected by God.",
            "Connections": ["9", "10"]
        },
        {
            "id": "12",
            "Name": "Solomon",
            "ImageURL": "",
            "Scriptural References": ["1 Kings, Proverbs, Ecclesiastes, Song of Songs"],
            "Region of Association": "Israel",
            "Occupation": "King and Sage",
            "Importance": "Son of David known for his wisdom and for building the Temple.",
            "Connections": ["9"]
        },
        {
            "id": "13",
            "Name": "Abraham",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Canaan",
            "Occupation": "Patriarch",
            "Importance": "Father of the Jewish nation and recipient of God's covenant.",
            "Connections": ["14", "15", "16"]
        },
        {
            "id": "14",
            "Name": "Sarah",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Canaan",
            "Occupation": "Matriarch",
            "Importance": "Wife of Abraham and mother of Isaac.",
            "Connections": ["13", "15"]
        },
        {
            "id": "15",
            "Name": "Isaac",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Canaan",
            "Occupation": "Patriarch",
            "Importance": "Son of Abraham and Sarah, father of Jacob and Esau.",
            "Connections": ["13", "14", "17", "18"]
        },
        {
            "id": "16",
            "Name": "Hagar",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Egypt/Canaan",
            "Occupation": "Servant/Mother",
            "Importance": "Egyptian servant of Sarah who bore Abraham's first son, Ishmael.",
            "Connections": ["13"]
        },
        {
            "id": "17",
            "Name": "Jacob",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Canaan",
            "Occupation": "Patriarch",
            "Importance": "Son of Isaac who was renamed Israel and fathered the twelve tribes.",
            "Connections": ["15", "18"]
        },
        {
            "id": "18",
            "Name": "Esau",
            "ImageURL": "",
            "Scriptural References": ["Genesis"],
            "Region of Association": "Canaan/Edom",
            "Occupation": "Hunter",
            "Importance": "Son of Isaac who sold his birthright to his brother Jacob.",
            "Connections": ["15", "17"]
        }
    ];

    // DOM elements
    const networkContainer = document.getElementById('network');
    const networkInner = document.getElementById('network-inner');
    const svg = document.getElementById('connections');
    const miniMap = document.getElementById('mini-map');
    const miniMapInner = document.getElementById('mini-map-inner');
    const miniMapSvg = document.getElementById('mini-map-svg');
    const miniMapViewport = document.getElementById('mini-map-viewport');
    const zoomInfo = document.getElementById('zoom-info');
    const detailsPanel = document.getElementById('details-panel');
    const detailImg = document.getElementById('detail-img');
    const detailInitial = document.getElementById('detail-initial');
    const detailName = document.getElementById('detail-name');
    const detailReferences = document.getElementById('detail-references');
    const detailRegion = document.getElementById('detail-region');
    const detailOccupation = document.getElementById('detail-occupation');
    const detailImportance = document.getElementById('detail-importance');
    const detailConnections = document.getElementById('detail-connections');
    const closeDetails = document.getElementById('close-details');
    const resetViewBtn = document.getElementById('reset-view');
    const fitViewBtn = document.getElementById('fit-view');
    
    // State variables
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let nodeElements = [];
    let svgWidth = 3000;
    let svgHeight = 3000;
    let networkWidth = window.innerWidth;
    let networkHeight = window.innerHeight;
    let highlightedConnections = [];
    
    // Initialize the network
    function initNetwork() {
        // Set up SVG size
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', svgHeight);
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        
        // Set up mini-map SVG
        miniMapSvg.setAttribute('width', miniMap.clientWidth);
        miniMapSvg.setAttribute('height', miniMap.clientHeight);
        
        createNodes();
        createConnections();
        updateMiniMap();
        centerView();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function createNodes() {
        // Clear any existing nodes
        while (networkInner.childNodes.length > 1) {
            if (networkInner.childNodes[1] !== svg) {
                networkInner.removeChild(networkInner.childNodes[1]);
            }
        }
        nodeElements = [];
        
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Use force-directed placement algorithm
        const nodeCount = peopleData.length;
        const radiusMultiplier = Math.min(nodeCount * 10, 300);
        
        peopleData.forEach((person, index) => {
            // Calculate initial position in a circle
            const angle = (index / nodeCount) * 2 * Math.PI;
            const radius = radiusMultiplier + (Math.random() * 100);
            const x = centerX + (radius * Math.cos(angle));
            const y = centerY + (radius * Math.sin(angle));
            
            createNode(person, x, y);
        });
        
        // Apply force-directed algorithm (simplified)
        for (let iteration = 0; iteration < 50; iteration++) {
            applyForces();
        }
        
        // Update node positions after force simulation
        nodeElements.forEach(node => {
            updateNodePosition(node);
        });
    }
    
    function createNode(person, x, y) {
        const node = document.createElement('div');
        node.className = 'node';
        node.dataset.id = person.id;
        node.dataset.name = person.Name;
        
        const portraitContainer = document.createElement('div');
        portraitContainer.style.position = 'relative';
        
        const portrait = document.createElement('img');
        portrait.className = 'portrait';
        portrait.alt = person.Name;
        
        // Use provided image or placeholder
        if (person.ImageURL && person.ImageURL.trim() !== '') {
            portrait.src = person.ImageURL;
        } else {
            // Generate unique placeholder based on name
            const hash = simpleHash(person.Name);
            const r = (hash & 0xFF0000) >> 16;
            const g = (hash & 0x00FF00) >> 8;
            const b = hash & 0x0000FF;
            portrait.src = `/api/placeholder/80/80`;
            portrait.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            
            // Add initials
            const initial = document.createElement('div');
            initial.className = 'initial';
            initial.textContent = person.Name.charAt(0);
            portraitContainer.appendChild(initial);
        }
        
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = person.Name;
        
        portraitContainer.appendChild(portrait);
        node.appendChild(portraitContainer);
        node.appendChild(name);
        
        // Position node
        node.style.left = `${x - 40}px`;
        node.style.top = `${y - 40}px`;
        
        // Add event listeners
        node.addEventListener('click', (event) => {
            showDetails(person);
            event.stopPropagation();
        });
        
        node.addEventListener('mouseenter', () => highlightConnections(person.id));
        node.addEventListener('mouseleave', () => resetHighlights());
        
        networkInner.appendChild(node);
        
        // Add to node elements array
        nodeElements.push({
            element: node,
            person: person,
            x: x,
            y: y,
            vx: 0,
            vy: 0
        });
    }
    
    function createConnections() {
        // Clear existing connections
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        
        // Create connections
        peopleData.forEach(person => {
            if (!person.Connections) return;
            
            const sourceNode = nodeElements.find(n => n.person.id === person.id);
            if (!sourceNode) return;
            
            person.Connections.forEach(targetId => {
                // Only create connection if source id < target id to avoid duplicates
                if (person.id < targetId) {
                    const targetNode = nodeElements.find(n => n.person.id === targetId);
                    if (!targetNode) return;
                    
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', sourceNode.x);
                    line.setAttribute('y1', sourceNode.y);
                    line.setAttribute('x2', targetNode.x);
                    line.setAttribute('y2', targetNode.y);
                    line.setAttribute('class', 'connection-line');
                    line.dataset.source = person.id;
                    line.dataset.target = targetId;
                    
                    svg.appendChild(line);
                }
            });
        });
        
        // Create mini-map connections
        updateMiniMapConnections();
    }
    
    function updateConnections() {
        // Update connection positions
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => {
            const sourceId = line.dataset.source;
            const targetId = line.dataset.target;
            
            const sourceNode = nodeElements.find(n => n.person.id === sourceId);
            const targetNode = nodeElements.find(n => n.person.id === targetId);
            
            if (sourceNode && targetNode) {
                line.setAttribute('x1', sourceNode.x);
                line.setAttribute('y1', sourceNode.y);
                line.setAttribute('x2', targetNode.x);
                line.setAttribute('y2', targetNode.y);
            }
        });
        
        // Update mini-map connections
        updateMiniMapConnections();
    }
    
    function highlightConnections(personId) {
        // Reset any current highlights
        resetHighlights();
        
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => {
            const sourceId = line.dataset.source;
            const targetId = line.dataset.target;
            
            if (sourceId === personId || targetId === personId) {
                line.style.stroke = '#ff5722';
                line.style.strokeWidth = '4';
                highlightedConnections.push(line);
                
                // Also highlight connected nodes
                const connectedId = sourceId === personId ? targetId : sourceId;
                const connectedNode = document.querySelector(`.node[data-id="${connectedId}"]`);
                if (connectedNode) {
                    connectedNode.style.transform = 'scale(1.1)';
                    connectedNode.style.boxShadow = '0 0 15px rgba(255, 87, 34, 0.7)';
                    highlightedConnections.push(connectedNode);
                }
            }
        });
    }
    
    function resetHighlights() {
        highlightedConnections.forEach(element => {
            if (element.tagName === 'line') {
                element.style.stroke = '';
                element.style.strokeWidth = '';
            } else {
                element.style.transform = '';
                element.style.boxShadow = '';
            }
        });
        highlightedConnections = [];
    }
    
    function applyForces() {
        // Apply repulsion between nodes
        for (let i = 0; i < nodeElements.length; i++) {
            for (let j = i + 1; j < nodeElements.length; j++) {
                const nodeA = nodeElements[i];
                const nodeB = nodeElements[j];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Minimum distance to maintain between nodes
                const minDistance = 150;
                
                if (distance < minDistance) {
                    const force = 0.5;
                    const fx = (dx / distance) * force * (minDistance - distance);
                    const fy = (dy / distance) * force * (minDistance - distance);
                    
                    nodeA.vx -= fx;
                    nodeA.vy -= fy;
                    nodeB.vx += fx;
                    nodeB.vy += fy;
                }
            }
        }
        
        // Apply attraction for connected nodes
        peopleData.forEach(person => {
            if (!person.Connections) return;
            
            const sourceNode = nodeElements.find(n => n.person.id === person.id);
            if (!sourceNode) return;
            
            person.Connections.forEach(targetId => {
                const targetNode = nodeElements.find(n => n.person.id === targetId);
                if (!targetNode) return;
                
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Optimal distance for connected nodes
                const optimalDistance = 200;
                
                if (distance > optimalDistance) {
                    const force = 0.01;
                    const fx = (dx / distance) * force * (distance - optimalDistance);
                    const fy = (dy / distance) * force * (distance - optimalDistance);
                    
                    sourceNode.vx += fx;
                    sourceNode.vy += fy;
                    targetNode.vx -= fx;
                    targetNode.vy -= fy;
                }
            });
        });
        
        // Apply central gravity to keep nodes from flying off
        nodeElements.forEach(node => {
            const dx = (svgWidth / 2) - node.x;
            const dy = (svgHeight / 2) - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const gravity = 0.001;
            node.vx += (dx / distance) * gravity * distance;
            node.vy += (dy / distance) * gravity * distance;
        });
        
        // Update positions
        nodeElements.forEach(node => {
            // Apply damping
            node.vx *= 0.9;
            node.vy *= 0.9;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Keep nodes within boundaries
            node.x = Math.max(50, Math.min(svgWidth - 50, node.x));
            node.y = Math.max(50, Math.min(svgHeight - 50, node.y));
        });
    }
    
    function updateNodePosition(node) {
        node.element.style.left = `${node.x - 40}px`;
        node.element.style.top = `${node.y - 40}px`;
    }
    
    function showDetails(person) {
        detailImg.src = person.ImageURL || `/api/placeholder/120/120`;
        
        // Add initials if using placeholder
        if (!person.ImageURL || person.ImageURL.trim() === '') {
            const hash = simpleHash(person.Name);
            const r = (hash & 0xFF0000) >> 16;
            const g = (hash & 0x00FF00) >> 8;
            const b = hash & 0x0000FF;
            detailImg.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            detailInitial.textContent = person.Name.charAt(0);
            detailInitial.style.display = 'block';
        } else {
            detailInitial.style.display = 'none';
        }
        
        detailName.textContent = person.Name;
        detailReferences.textContent = person["Scriptural References"] ? person["Scriptural References"].join(', ') : 'N/A';
        detailRegion.textContent = person["Region of Association"] || 'Unknown';
        detailOccupation.textContent = person.Occupation || 'Unknown';
        detailImportance.textContent = person.Importance || 'N/A';
        
        // Show connections
        detailConnections.innerHTML = '';
        if (person.Connections && person.Connections.length > 0) {
            const connectionList = document.createElement('ul');
            
            person.Connections.forEach(connId => {
                const connectedPerson = peopleData.find(p => p.id === connId);
                if (connectedPerson) {
                    const li = document.createElement('li');
                    
                    // Create a connection link
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = connectedPerson.Name;
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        showDetails(connectedPerson);
                    });
                    li.appendChild(link);
                    connectionList.appendChild(li);
                }
            });
            detailConnections.appendChild(connectionList);
        } else {
            detailConnections.textContent = 'None';
        }
        detailsPanel.style.display = 'block';
    }

    // Close details panel when close button is clicked
    closeDetails.addEventListener('click', () => {
        detailsPanel.style.display = 'none';
    });

    // Simple hash function to generate a number from a string
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    // Update mini-map connections
    function updateMiniMapConnections() {
        // Clear mini-map SVG
        while (miniMapSvg.firstChild) {
            miniMapSvg.removeChild(miniMapSvg.firstChild);
        }
        // Recreate connections on mini-map
        const lines = svg.querySelectorAll('line');
        lines.forEach(line => {
            const miniLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            miniLine.setAttribute('x1', line.getAttribute('x1') * miniMap.clientWidth / svgWidth);
            miniLine.setAttribute('y1', line.getAttribute('y1') * miniMap.clientHeight / svgHeight);
            miniLine.setAttribute('x2', line.getAttribute('x2') * miniMap.clientWidth / svgWidth);
            miniLine.setAttribute('y2', line.getAttribute('y2') * miniMap.clientHeight / svgHeight);
            miniLine.setAttribute('stroke', '#aaa');
            miniLine.setAttribute('stroke-width', '1');
            miniMapSvg.appendChild(miniLine);
        });
    }

    // Update mini-map viewport to reflect current view
    function updateMiniMap() {
        const miniWidth = miniMap.clientWidth;
        const miniHeight = miniMap.clientHeight;
        const viewWidth = networkWidth / scale * (miniWidth / svgWidth);
        const viewHeight = networkHeight / scale * (miniHeight / svgHeight);
        miniMapViewport.style.width = `${viewWidth}px`;
        miniMapViewport.style.height = `${viewHeight}px`;
        const posX = (-translateX / svgWidth) * miniWidth;
        const posY = (-translateY / svgHeight) * miniHeight;
        miniMapViewport.style.left = `${posX}px`;
        miniMapViewport.style.top = `${posY}px`;
    }

    // Center the view on the network
    function centerView() {
        scale = 1;
        translateX = (networkWidth - svgWidth) / 2;
        translateY = (networkHeight - svgHeight) / 2;
        updateTransform();
    }

    // Fit all nodes in view (basic implementation)
    function fitView() {
        // For simplicity, recenter the view
        centerView();
    }

    // Update transform on networkInner container
    function updateTransform() {
        networkInner.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        updateMiniMap();
    }

    // Setup mouse and wheel event listeners for dragging and zooming
    function setupEventListeners() {
        networkContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            networkContainer.classList.add('grabbing');
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                translateX += dx;
                translateY += dy;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                updateTransform();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            networkContainer.classList.remove('grabbing');
        });

        networkContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.min(Math.max(0.5, scale + delta), 2);
            updateTransform();
            zoomInfo.textContent = `Zoom: ${Math.round(scale * 100)}% | Drag to move, scroll to zoom`;
        });

        resetViewBtn.addEventListener('click', centerView);
        fitViewBtn.addEventListener('click', fitView);
    }

    // Animation loop for force simulation and updating node positions and connections
    function animate() {
        applyForces();
        nodeElements.forEach(node => {
            updateNodePosition(node);
        });
        updateConnections();
        requestAnimationFrame(animate);
    }

    // Initialize the network and start the animation
    initNetwork();
    animate();