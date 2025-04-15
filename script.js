// Wrap most code in DOM ready function to ensure elements exist
// Using jQuery's ready function
jQuery(document).ready(function($) {

    // --- Plugin Initializations ---

    // Datepicker Initialization (jQuery UI)
    try {
        if ($.fn.datepicker) {
            var dateFormat = "mm/dd/yy"; // Consistent date format
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            var fromDate = $("#txtFromDate, #txtFromDateMO").datepicker({
                dateFormat: dateFormat,
                minDate: 0, // Can't select past dates
                numberOfMonths: 1, // Show one month
                changeMonth: true, // Allow month change
                changeYear: true // Allow year change
            })
            .on("change", function() {
                // Set minDate for check-out date based on check-in date
                var selectedDate = getDate(this);
                if (selectedDate) {
                    var minCheckoutDate = new Date(selectedDate);
                    minCheckoutDate.setDate(selectedDate.getDate() + 1); // Check-out must be at least 1 day after check-in
                    toDate.datepicker("option", "minDate", minCheckoutDate);
                } else {
                     toDate.datepicker("option", "minDate", tomorrow); // Default if check-in is cleared
                }
            });

            var toDate = $("#txtToDate, #txtToDateMO").datepicker({
                dateFormat: dateFormat,
                minDate: tomorrow, // Check-out must be at least tomorrow initially
                numberOfMonths: 1,
                changeMonth: true,
                changeYear: true
            })
            .on("change", function() {
                // Optional: Set maxDate for check-in date based on check-out date
                 var selectedCheckoutDate = getDate(this);
                 if (selectedCheckoutDate) {
                    var maxCheckinDate = new Date(selectedCheckoutDate);
                    maxCheckinDate.setDate(selectedCheckoutDate.getDate() - 1); // Check-in must be before check-out
                    // fromDate.datepicker("option", "maxDate", maxCheckinDate); // Uncomment if needed
                 } else {
                    // fromDate.datepicker("option", "maxDate", null); // Remove max date if checkout cleared
                 }
            });

            // Helper function to get date object from datepicker input
            function getDate(element) {
                var date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch(error) {
                    date = null;
                }
                return date;
            }

             // Ensure mobile date inputs trigger datepicker (readonly attribute added in HTML)
             // Binding click explicitly can sometimes help on mobile
             $("#txtFromDateMO, #txtToDateMO").on('click', function() {
                 $(this).datepicker('show');
             });

        } else {
            console.warn("jQuery UI Datepicker not loaded.");
        }

        // Datetimepicker Initialization (Placeholder)
        // if ($.fn.datetimepicker) { ... }

    } catch (e) {
        console.error("Error initializing datepickers:", e);
    }


    // Fancybox Initialization (Placeholder)
    try {
        if ($.fn.fancybox) {
            // Example: $('a.fancybox-image').fancybox({...});
             console.info("Fancybox loaded (example selector: a.fancybox-image). Ensure you have elements matching your selector.");
        } else {
             console.warn("Fancybox library not loaded.");
        }
    } catch (e) {
        console.error("Error initializing Fancybox:", e);
    }

    // Isotope Initialization (Placeholder)
    try {
        if ($.fn.isotope) {
            // Example: var $grid = $('.isotope-grid').isotope({...});
             console.info("Isotope loaded (example selector: .isotope-grid). Ensure you have elements matching your selector.");
        } else {
            console.warn("Isotope library not loaded.");
        }
    } catch (e) {
        console.error("Error initializing Isotope:", e);
    }

     // carouFredSel Initialization (Warning)
    try {
        if ($.fn.carouFredSel) {
             console.warn("carouFredSel loaded, but conflicts with Bootstrap Carousel. Using Bootstrap's carousel is recommended.");
        }
    } catch (e) {
        // Ignore error if library isn't present
    }

    // HTML5 Lightbox (Usually self-initializing)


    // --- Custom Scripts ---

    // Sticky Header Logic
    var headerBar = $('#the-top-fixed-bar');
    var headerPlaceholder = $('#header-placeholder'); // Get placeholder element

    if (headerBar.length) {
        var headerBarOffset = headerBar.offset().top;
        var $window = $(window);

        var handleStickyHeader = function() {
            var scrollTop = $window.scrollTop();
            var isFixed = headerBar.hasClass('fixed-header');
            var headerHeight = headerBar.outerHeight(); // Get current height

            if (scrollTop > headerBarOffset) {
                if (!isFixed) {
                    // Set placeholder height *before* fixing header
                    headerPlaceholder.css('height', headerHeight + 'px').show();
                    headerBar.addClass('fixed-header');
                }
            } else {
                if (isFixed) {
                    headerBar.removeClass('fixed-header');
                    headerPlaceholder.hide().css('height', '0px'); // Hide placeholder
                }
            }
        };

        $window.on('scroll resize', handleStickyHeader); // Handle resize too
        handleStickyHeader(); // Run on page load
    } else {
        console.warn("Sticky header element #the-top-fixed-bar not found.");
    }


    // Booking Modal Adults/Children Counter Logic
    var adultCountInput = $('#adultcount');
    var childCountInput = $('#childcount');
    var adultDisplay = $('#adultcount_display');
    var childDisplay = $('#childcount_display');

    function updateDisplayCounts() {
        // Ensure inputs have valid numbers, default to min values if not
        var adults = parseInt(adultCountInput.val()) || 1;
        var children = parseInt(childCountInput.val()) || 0;

        // Enforce min/max if necessary (e.g., max adults/children)
        adults = Math.max(1, adults); // Min 1 adult
        children = Math.max(0, children); // Min 0 children

        // Update the input values to reflect validated numbers
        adultCountInput.val(adults);
        childCountInput.val(children);

        // Update the display spans
        adultDisplay.text(adults);
        childDisplay.text(children);
    }

    if(adultCountInput.length && childCountInput.length && adultDisplay.length && childDisplay.length) {
        updateDisplayCounts(); // Initial sync

        $('#adultplus').click(function(e){
            e.preventDefault();
            e.stopPropagation(); // Prevent dropdown from closing
            var currentVal = parseInt(adultCountInput.val()) || 0;
            adultCountInput.val(currentVal + 1);
            updateDisplayCounts();
        });

        $('#adultminus').click(function(e){
            e.preventDefault();
             e.stopPropagation();
            var currentVal = parseInt(adultCountInput.val()) || 0;
            if (currentVal > 1) { // Minimum 1 adult
                adultCountInput.val(currentVal - 1);
                updateDisplayCounts();
            }
        });

        $('#ccplus').click(function(e){
            e.preventDefault();
             e.stopPropagation();
            var currentVal = parseInt(childCountInput.val()) || 0;
            childCountInput.val(currentVal + 1);
             updateDisplayCounts();
        });

        $('#ccminus').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var currentVal = parseInt(childCountInput.val()) || 0;
            if (currentVal > 0) { // Minimum 0 children
                childCountInput.val(currentVal - 1);
                updateDisplayCounts();
            }
        });

        // Prevent dropdown from closing when clicking inside the menu, except on 'Apply'
        $('.guest-dropdown-menu').on('click', function(e) {
             if (!$(e.target).hasClass('closeadultnum') && !$(e.target).closest('.closeadultnum').length) {
                e.stopPropagation();
            }
        });

        // Close dropdown when 'Apply' is clicked
        $('.closeadultnum').on('click', function(e){
            e.preventDefault();
            e.stopPropagation(); // Stop propagation first
            updateDisplayCounts(); // Ensure display reflects latest input values
            $(this).closest('.btn-group.open').removeClass('open'); // Close the dropdown
        });

         // Update display if user types/changes the number input
         $('.qty-selector input.count').on('change blur', function() {
            updateDisplayCounts();
         });

    } else {
         console.warn("Booking modal guest counter elements not all found.");
    }

    // "Read More" Toggle Logic
    // CSS primarily handles the text change via [aria-expanded]
    // This JS ensures the attribute is toggled correctly by Bootstrap's collapse plugin.
    // No need for manual text swapping here if CSS is handling it.
    $('#readMoreContent').on('show.bs.collapse', function () {
        $('.read-more-link[href="#' + $(this).attr('id') + '"]').attr('aria-expanded', 'true');
    }).on('hide.bs.collapse', function () {
        $('.read-more-link[href="#' + $(this).attr('id') + '"]').attr('aria-expanded', 'false');
    });


    // Update Footer Year
    var currentYear = new Date().getFullYear();
    $('#current-year').text(currentYear);


    // --- Initialize Bootstrap Carousels ---
    // Ensure they are initialized if data-ride isn't sufficient in all cases
    $('#nycCarouselDesktop, #nycCarouselMobile').carousel();


    // --- Typekit Font Loader ---
    // Place Typekit load script here or ensure it's loaded via its own script tag
    try {
        // Example: If using the standard Typekit JS snippet
        // Typekit.load({ async: true });
        // If Typekit is loaded via a <script> tag in <head>, this isn't needed here.
        console.info("Ensure Adobe Fonts (Typekit) is loaded correctly via its script.");
    } catch (e) {
        console.error("Typekit loading error:", e);
    }


}); // End jQuery $(document).ready()

// --- Potentially Global Functions ---

// Navigate Function (Map links)
function navigate(lat, lng) {
    if (typeof lat === 'undefined' || typeof lng === 'undefined') {
        console.error("Navigate function called without latitude or longitude.");
        return;
    }
    // Basic iOS detection
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Construct URLs
    var appleMapsUrl = 'maps://maps.apple.com/?daddr=' + lat + ',' + lng;
    var googleMapsUrl = 'https://maps.google.com/maps?daddr=' + lat + ',' + lng;

    if (isIOS) {
        // On iOS, attempt to open Apple Maps first
        window.location.href = appleMapsUrl;
        // Provide a fallback timeout to open Google Maps if Apple Maps fails
        // setTimeout(function() {
        //     window.open(googleMapsUrl, '_blank'); // Fallback in new tab
        // }, 1000); // Adjust timeout as needed
    } else {
        // Use Google Maps for others (open in new tab)
        window.open(googleMapsUrl, '_blank', 'noopener');
    }
}
