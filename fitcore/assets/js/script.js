// FitFeky Optimized UI Scripts
$(document).ready(function() {
    'use strict';

    // Cache common selectors
    const $body = $('body');
    const $mobileMenu = $(".menu-content");
    const $mobileSubmenu = $(".mobail-submenu");

    // === Mobile Menu ===
    $(".mobile-menu .menu-toggle").on('click', function() {
        if ($mobileMenu.length) $mobileMenu.stop().slideToggle(300);
    });

    $(".mobile-menu .fa-chevron-down").on('click', function() {
        if ($mobileSubmenu.length) $mobileSubmenu.stop().slideToggle(300);
    });

    // === Search Popup ===
    const $searchIcon = $('.search-icon');
    if ($searchIcon.length) {
        $searchIcon.on('click', function() {
            $body.addClass('search-active');
        });
        $('.search-close').on('click', function() {
            $body.removeClass('search-active');
        });
    }

    // === Venobox ===
    const $venobox = $(".venobox");
    if ($venobox.length && typeof $.fn.venobox === 'function') {
        $venobox.venobox();
    }

    // === Accordion ===
    const $accordionHeaders = $(".accordion-header");
    if ($accordionHeaders.length) {
        $accordionHeaders.first().addClass("active");
        $(".accordion-content").first().show();

        $accordionHeaders.on('click', function() {
            const $this = $(this);
            const $content = $this.next(".accordion-content");
            
            $this.toggleClass("active");
            if ($content.length) $content.stop().slideToggle(300);

            $(".accordion-content").not($content).stop().slideUp(300);
            $accordionHeaders.not($this).removeClass("active");
        });
    }

    // === Carousels ===
    if (typeof $.fn.owlCarousel === 'function') {
        const carouselOptions = {
            hero: { items: 1, loop: true, autoplay: true, dots: true, nav: true },
            testimonial: { items: 1, loop: true, autoplay: true, autoplayTimeout: 5000 },
            brand: {
                items: 6, margin: 160, loop: true, autoplay: true, autoplayTimeout: 5000, dots: false,
                responsive: { 0: { items: 1 }, 768: { items: 3, margin: 100 }, 992: { items: 4, margin: 80 }, 1200: { items: 6 } }
            }
        };

        if ($(".hero-carousel").length) $(".hero-carousel").owlCarousel(carouselOptions.hero);
        if ($(".testimonial-carousel").length) $(".testimonial-carousel").owlCarousel(carouselOptions.testimonial);
        if ($(".brand-carousel").length) $(".brand-carousel").owlCarousel(carouselOptions.brand);
    }

    // === Dynamic Button Hover Effect ===
    $('.button').on('mouseenter mousemove', function(e) {
        const $this = $(this);
        const offset = $this.offset();
        if (offset) {
            const x = e.pageX - offset.left;
            const y = e.pageY - offset.top;
            $this.find('span').css({ top: y, left: x });
        }
    });

});