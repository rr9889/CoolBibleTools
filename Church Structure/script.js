document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, scrollLeft, scrollTop;
    let scale = 1;
    const initialScale = 1;
    const dragThreshold = 5;

    // Structure switcher
    document.querySelectorAll('.structure-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.structure-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const structureId = this.id.split('-')[0] + '-structure';
            document.querySelectorAll('.chart-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(structureId).classList.remove('hidden');

            document.getElementById('explanation-title').textContent = this.textContent + ' Church Structure';
            document.querySelectorAll('.explanation > div').forEach(d => d.classList.add('hidden'));
            document.getElementById(structureId.split('-')[0] + '-explanation').classList.remove('hidden');

            resetView();
        });
    });

    // Box click handlers
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function(e) {
            if (hasMoved) return;
            e.stopPropagation();
            const boxId = this.id;
            const popup = document.getElementById(`popup-${boxId}`);

            document.querySelectorAll('.popup').forEach(p => {
                if (p !== popup && p.id !== 'explanation') {
                    p.style.display = 'none';
                }
            });

            if (popup) {
                togglePopup(popup, this);
            }
        });
    });

    // Dragging
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('mouseleave', endDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        hasMoved = false;
        container.style.cursor = 'grabbing';

        const event = e.type.includes('touch') ? e.touches[0] : e;
        startX = event.clientX;
        startY = event.clientY;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const event = e.type.includes('touch') ? e.touches[0] : e;
        const dx = (startX - event.clientX) / scale;
        const dy = (startY - event.clientY) / scale;

        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
            hasMoved = true;
        }

        container.scrollLeft = scrollLeft + dx;
        container.scrollTop = scrollTop + dy;
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
        }
    }

    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => zoom(0.1));
    document.getElementById('zoom-out').addEventListener('click', () => zoom(-0.1));
    document.getElementById('reset-view').addEventListener('click', resetView);
    document.getElementById('recall-btn').addEventListener('click', centerChart);

    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        zoom(e.deltaY < 0 ? 0.05 : -0.05);
    }, { passive: false });

    function zoom(delta) {
        const oldScale = scale;
        scale = Math.max(0.5, Math.min(2.0, scale + delta));
        if (scale !== oldScale) {
            updateZoom();
        }
    }

    function updateZoom() {
        const currentChart = document.querySelector('.chart-content:not(.hidden) .chart-svg');
        if (currentChart) {
            currentChart.style.transform = `scale(${scale})`;
            currentChart.style.transformOrigin = 'top left';
        }
    }

    function resetView() {
        scale = initialScale;
        updateZoom();
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }

    function centerChart() {
        const currentChart = document.querySelector('.chart-content:not(.hidden) .chart-svg');
        if (currentChart) {
            const effectiveWidth = 800 * scale;
            const effectiveHeight = 600 * scale;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            container.scrollLeft = Math.max(0, (effectiveWidth - containerWidth) / 2);
            container.scrollTop = Math.max(0, (effectiveHeight - containerHeight) / 2);
        }
    }

    function togglePopup(popup, box) {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            const boxRect = box.getBoundingClientRect();
            const popupWidth = 250;
            let top = boxRect.bottom + window.scrollY;
            let left = boxRect.left + (boxRect.width / 2) - (popupWidth / 2) + window.scrollX;

            left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));

            popup.style.top = `${top}px`;
            popup.style.left = `${left}px`;
            popup.style.display = 'block';
        }
    }

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.box') && !e.target.closest('.popup')) {
            document.querySelectorAll('.popup').forEach(p => {
                if (p.id !== 'explanation') p.style.display = 'none';
            });
        }
    });
});