$(document).ready(function() {
    const $chart = $('#org-chart');
    const $container = $('.container');
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    let scale = 1;
    const initialScale = 1;

    // Initial setup
    centerChart();
    updateZoom();

    // Structure switcher functionality
    $('.structure-btn').click(function() {
        const $this = $(this);
        $('.structure-btn').removeClass('active');
        $this.addClass('active');

        const structureId = $this.attr('id').split('-')[0] + '-structure';
        $('.chart-content').addClass('hidden');
        $('#' + structureId).removeClass('hidden');

        $('#explanation-title').text($this.text() + ' Church Structure');
        $('.explanation > div').addClass('hidden');
        $('#' + structureId.split('-')[0] + '-explanation').removeClass('hidden');

        resetView();
    });

    // Dragging functionality
    $chart.on('mousedown touchstart', function(e) {
        e.preventDefault();
        isDragging = true;
        $chart.addClass('grabbing');

        const event = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;
        startX = event.clientX;
        startY = event.clientY;
        scrollLeft = $container.scrollLeft();
        scrollTop = $container.scrollTop();
    });

    $(document).on('mousemove touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();

        const event = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;
        const dx = (startX - event.clientX) / scale;
        const dy = (startY - event.clientY) / scale;

        $container.scrollLeft(scrollLeft + dx);
        $container.scrollTop(scrollTop + dy);
    });

    $(document).on('mouseup touchend mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            $chart.removeClass('grabbing');
        }
    });

    // Zoom functionality
    $('#zoom-in').click(function() {
        scale = Math.min(scale + 0.1, 2.0);
        updateZoom();
        maintainScrollPosition();
    });

    $('#zoom-out').click(function() {
        scale = Math.max(scale - 0.1, 0.5);
        updateZoom();
        maintainScrollPosition();
    });

    $('#reset-view').click(resetView);

    $('#recall-btn').click(centerChart);

    $container.on('wheel', function(e) {
        e.preventDefault();
        const zoomStep = 0.05;
        const oldScale = scale;

        scale = Math.max(0.5, Math.min(2.0,
            scale + (e.originalEvent.deltaY < 0 ? zoomStep : -zoomStep)
        ));

        if (scale !== oldScale) {
            updateZoom();
            maintainScrollPosition(e);
        }
    });

    function updateZoom() {
        $chart.css({
            'transform': `scale(${scale})`,
            'transform-origin': 'center'
        });
    }

    function centerChart() {
        const containerWidth = $container.width();
        const containerHeight = $container.height();
        const chartWidth = $chart[0].scrollWidth * scale;
        const chartHeight = $chart[0].scrollHeight * scale;

        $container.scrollLeft((chartWidth - containerWidth) / 2);
        $container.scrollTop((chartHeight - containerHeight) / 2);
    }

    function maintainScrollPosition(e = null) {
        const containerWidth = $container.width();
        const containerHeight = $container.height();
        let focusX = containerWidth / 2;
        let focusY = containerHeight / 2;

        if (e && e.originalEvent) {
            focusX = e.originalEvent.clientX - $container.offset().left;
            focusY = e.originalEvent.clientY - $container.offset().top;
        }

        const scrollX = $container.scrollLeft();
        const scrollY = $container.scrollTop();
        const newScrollX = (scrollX + focusX) * scale / (scale + 0.1) - focusX;
        const newScrollY = (scrollY + focusY) * scale / (scale + 0.1) - focusY;

        $container.scrollLeft(newScrollX);
        $container.scrollTop(newScrollY);
    }

    function resetView() {
        scale = initialScale;
        updateZoom();
        centerChart();
    }

    // Popup functionality
    $('.box').click(function(e) {
        e.stopPropagation();
        const boxId = $(this).attr('id');
        const $popup = $(`#popup-${boxId}`);

        $('.popup').not($popup).not('#explanation').hide();

        if ($popup.length) {
            if ($popup.is(':visible')) {
                $popup.hide();
            } else {
                const boxOffset = $(this).offset();
                const boxHeight = $(this).outerHeight();
                const boxWidth = $(this).outerWidth();
                const popupWidth = $popup.outerWidth();

                let top = boxOffset.top + boxHeight;
                let left = boxOffset.left;

                if (left + popupWidth > $(window).width()) {
                    left = boxOffset.left + boxWidth - popupWidth;
                }
                if (left < 0) left = 0;

                $popup.css({
                    top: top,
                    left: left,
                    'pointer-events': 'auto'
                }).show();
            }
        } else {
            console.warn(`No popup found for box ID: ${boxId}`);
        }
    });

    $('#help-btn').click(function(e) {
        e.stopPropagation();
        $('#explanation').toggle();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.box, .popup, #help-btn, .zoom-controls, #recall-btn').length) {
            $('.popup').hide().css('pointer-events', 'none');
        }
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('.popup').hide().css('pointer-events', 'none');
        }
    });

    $(window).resize(debounce(centerChart, 250));

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});