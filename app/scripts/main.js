var got_to_page = [];

function initStuff() {

	// CACHED $() ELEMENTS
	var $main = $('#main');
	var $nav = $('#nav');
	var $feed = $('#tweetGrid');
	// BACKGROUND ROTATION MATH DEGREES
	var d = [];
	// TWITTER EXTERNAL POPUP WINDOW
	// & POLLING TO CHECK FOR CLOSED WINDOW
	var popUp;
	var pollTimer;

	// GOOGLE ANALYTICS CUSTOM PAGE VIEW EVENT
	function addPageview (page) {
		if (got_to_page.indexOf(page) < 0 && page !== 0) {
			ga('send','event','page','got_to_page','got_to_page_'+page);
			got_to_page.push(page);
		} else {
			ga('send','event','page','viewed_page','viewed_page_'+page);
		}
	}

	// TWITTER FEED LOAD
	function loadTweets() {
		$feed.addClass('tweetsLoading').load('feed.php', function(){
	    savvior.init('#tweetGrid', {
			  'screen and (max-width: 40em)': { columns: 1 },
			  'screen and (min-width: 40.063em)': { columns: 2 },
		  });
		  $feed.removeClass('tweetsLoading').addClass('tweetsLoaded');
		});
	}

	/* ------------- */
  /* SLIDE CHANGES */
  /* ------------- */

	// before slide change
	function beforeChange(event, slick, currentSlide, nextSlide){

		switch (currentSlide) {
			case 0:
				$('#mainTitle').addClass('animated slideOutDown');
				$('#slick-prev').attr('tabindex', '0');
				break;
			case 1:
				$('.blockier').addClass('animated slideOutUp');
				break;
			case 2:
				$('#hunterWrap').addClass('animated slideOutDown');
				$('.floater').removeClass('floatExpand');
				$('#floatWrap').addClass('animated fadeOut');
				break;
			case 3:
				$('#hunterTour').addClass('animated fadeOutDown');
				$('#tip-tours').attr('tabindex', '-1');
				break;
			case 4:
				$('#tweetInput').attr('tabindex', '-1');
				break;
			case 5:
				break;
			case 6:
				$('#slick-next').attr('tabindex', '0');
				break;
		}

		$('#inner').css('transform', 'translateY(-50%) translateX(-50%) rotate(-' + d[nextSlide] + 'deg)');
	}

	//after slide change
	function afterChange(event, slick, currentSlide, nextSlide){
		addPageview(currentSlide);
		switch (currentSlide) {
			case 0:
				$('#mainTitle').removeClass('animated slideOutDown bounceInUp').addClass('animated bounceInUp');
				$('#slick-prev').attr('tabindex', '-1');
				break;
			case 1:
				$('.blockier').removeClass('animated slideOutUp bounceInDown').addClass('animated bounceInDown');
				break;
			case 2:
				$('#hunterWrap').removeClass('animated slideOutDown rotateInUpLeft').addClass('animated rotateInUpLeft');
				$('#floatWrap').removeClass('animated fadeOut bounceInDown').addClass('animated bounceInDown');
				setTimeout(function(){
					$('.floater').addClass('floatExpand');
				}, 1000);
				break;
			case 3:
				$('#hunterTour').removeClass('animated fadeOutDown').addClass('animated fadeInRight');
				$('#tip-tours').attr('tabindex', '0');
				break;
			case 4:
				break;
			case 5:
				if ($feed.hasClass('tweetsLoaded') != true) {
					loadTweets();
				}
				break;
			case 6:
				$('#slick-next').attr('tabindex', '-1');
				break;
		}
	}

	// TOOLTIP INITS AND OPTIONS
	$('.tooltipBtm').powerTip({
		placement: 's',
		smartPlacement: true,
		mouseOnToPopup: true,
		closeDelay: 600
	});

	$('.tooltipTop').powerTip({
		placement: 'n',
		smartPlacement: true,
		mouseOnToPopup: true,
		closeDelay: 600
	});

	$('#tip-helpdesk').data('powertip', 'Having trouble logging into your admissions portal? Contact our <a href="mailto:servicedesk@dc-uoit.ca" title="Send an email to the IT Help Desk">Information Technology (IT) Help Desk</a> at <a href="tel:9057213333">905.721.3333</a>.');
	$('#tip-ouac').data('powertip', 'If you need to change your OUAC application, refer to the <a href="http://www.ouac.on.ca/ugrad-tutorials/">OUAC How-to Tutorials</a>.');
	$('#tip-ouac-105').data('powertip', 'If you need to change your OUAC application, refer to the <a href="http://www.ouac.on.ca/ugrad-tutorials-ouac-105/">OUAC How-to Tutorials</a>.');
	$('#tip-tours').data('powertip', 'Explore UOIT online! Visit <a href="http://uoit.ca/virtualtour">uoit.ca/virtualtour</a>.');

	// TWITTER/TWEET POPUP
	function tweetPopup(url, w, h) {
		// Fixes dual-screen position in most browsers
		let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		let dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
		let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
		let left = ((width / 2) - (w / 2)) + dualScreenLeft;
		let top = ((height / 2) - (h / 2)) + dualScreenTop;

		popUp = window.open(url, 'Send tweet', 'menubar=0,status=0,resizable=0,width='+w+',height='+h+',top='+top+',left='+left);
		pollTimer = window.setInterval(function() {
	    if (popUp.closed !== false) { // !== is required for compatibility with Opera
				$('#modalOverlay').fadeOut();
				if ($main.hasClass('slick-initialized')) {
					$main.slick('next');
				} else {
					loadTweets();
				}
	      window.clearInterval(pollTimer);
	    }
		}, 500);
		// Puts focus on the newWindow
		if (window.focus) {
			popUp.focus();
		}
	}

	$('#tweeter').on('click', function(event) {
		$('#modalOverlay').fadeIn();
		var text = $('#tweetInput').val();
		var hashtags = '';
		if (text.toLowerCase().indexOf('#whatsnextuoit') <= 0) {
			hashtags = '&hashtags=WhatsnextUOIT';
		}
		text = encodeURIComponent(text);
		tweetPopup('https://twitter.com/intent/tweet?text='+text+hashtags, 600, 400);
	});

	// OUICAL "ADD TO CALENDAR" BUTTON
	function reviveDate(value, i) {
    if (typeof value === 'string' && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
      return new Date(value);
    } else {
    	console.warn('Invalid date format in event '+i, value);
    	return value;
    }
	}

	function loadEvents(data) {
		$('.addtoCal').each((index, el) => {
			// parse event dates
			var event = data[index];
			event.start = reviveDate(event.start, index);
			event.end = reviveDate(event.end, index);
			// pass calendar data to button generator
			var cal = addToCalendar(event);
			console.info('Event loaded:', event, cal);
			// add generated calendar links to buttons
			// bind keydown to capture keyboard 'clicks'
			$(el).append(cal).keydown(event => {
				if (event.which == 13) {
					$(el).find('.add-to-calendar-checkbox').attr('checked', 'checked');
				}
			});
		});
		console.info('All event data loaded!');
	}

	window.loadEvents = function(level) {
		$.getJSON('data/'+level+'.json', loadEvents);
	}


  /* -------------- */
  /*  MOBILE CHECK  */
  /* -------------- */

	function desktopInit() { // IF NOT MOBILE:
		var moodle = new Moodle('#modal', {
			page: '#main',
			overlay: '#modalOverlay'
		});

		$('#accessInfo').on('click', function() {
			moodle.show();
		});

		$('#home').unbind('scroll');
		// BACKGROUND ROTATION
		var count = $('.slide').length;
		var incr = 360/count;
		for (var i = 0; i < count; i++) {
			d[i] = incr * i;
		};
		d.push(360);

		// INIT MAIN GALLERY SLIDER AND NAV
		$main.slick({
			asNavFor: '#nav',
		  dots: true,
		  arrows: true,
		  appendArrows: '#controls',
		  appendDots: '#controls',
		  prevArrow: '<a href="javascript:;" id="slick-prev" class="slick-prev" onclick="ga(\'send\',\'event\',\'button\',\'click\',\'click_prevpage_btn\');"><span class="icon ion-android-arrow-dropleft-circle"></span></a>',
		  nextArrow: '<a href="javascript:;" id="slick-next" class="slick-next" onclick="ga(\'send\',\'event\',\'button\',\'click\',\'click_nextpage_btn\');"><span class="icon ion-android-arrow-dropright-circle"></span></a>',
		  infinite: false,
		  speed: 1500,
		  cssEase: 'cubic-bezier(0.285, -0.520, 0.010, 1.350)',
		  slidesToShow: 1
		}).on('afterChange', afterChange).on('beforeChange', beforeChange);

		$('#controls').prepend('<button type="button" role="button" id="skipButton" tabindex="0">Skip to content</button>');
		$('#skipButton').click(function(event) {
			$('.slick-current').find(':focusable').first().focus();
			ga('send','event','button','click','click_skiptocont_btn');
		});

		$nav.slick({
			asNavFor: '#main',
			dots: false,
			arrows: false,
			infinite: false,
			slidesToShow: count,
			focusOnSelect: true
		}).find('li').attr('tabindex', '-1');

		$('#slick-prev').attr('tabindex', '-1');


		$('.nextButton').on('click', function(event) {
			event.preventDefault();
			$main.slick('next');
		});

		// FITTEXT INITS
		$('#mainTitle h1').fitText(0.5);
		$('h2:not(.modalContent h2, .galleryHead h2, .sectionHead h2)').fitText(1.3);
		$('.blockier li:not(.blockNote)').fitText(2.1);
		$('.panel.rightCurve h2').fitText(1.5);
		$('.floater h2').fitText(1.4);

		// init animation
		$('#mainTitle').addClass('animated bounceInUp');
	}

	function mobileInit() { // IF IS MOBILE:
		if ($main.hasClass('slick-initialized')) {
			$main.slick('destroy');
		}
		if ($nav.hasClass('slick-initialized')) {
			$nav.slick('destroy');
		}
		$(window).off('resize.fittext orientationchange.fittext');
		$('#mainTitle h1, h2:not(.modalContent h2), .blockier li:not(.blockNote), .floater h2').css('font-size', '');

		var height = $(document).height();
		var incr = 360/height;

		$('.nextButton').off('click').on('click', function() {
			var target = $(this).data('anchor');
      target = $(target);
			var offset = target.offset().top;
      if (target.length) {
        $('#home').animate({
          scrollTop: offset
        }, 700, 'swing');
        return false;
      }
		});

		$('#home').scroll(function(event) {
		  var scrollTop = $('#home').scrollTop();
			$('#inner').css('transform', 'translateY(-50%) translateX(-50%) rotate(-' + (incr*scrollTop)/10 + 'deg)');
			if ($feed.visible(true) == true && $feed.hasClass('tweetsLoaded') != true) {
				$feed.addClass('tweetsLoading').load('feed.php', function(){
			    savvior.init('#tweetGrid', {
					  'screen and (max-width: 64em)': { columns: 1 },
					  'screen and (min-width: 64.063em)': { columns: 2 },
				  });
				  $feed.removeClass('tweetsLoading').addClass('tweetsLoaded');
				});
			}
		});
		// init animation
		$('#mainTitle').addClass('animated bounceInUp');
	}

  enquire.register('screen and (min-width: 64.063em)', {
  	setup: mobileInit,
    match : desktopInit,  
    unmatch : mobileInit
	});

  savvior.init('#gallery', {
	  'screen and (max-width: 40em)': { columns: 1 },
	  'screen and (min-width: 40.063em) and (max-width: 64em)': { columns: 2 },
	  'screen and (min-width: 64.063em)': { columns: 3 },
  });
	
	$('#mainTitle').addClass('animated bounceInUp');
} // END initStuff()

// CREATE ':focusable' SELECTOR
jQuery.extend(jQuery.expr[':'], {
    focusable: function(el, index, selector) {
    	return $(el).is('a, button, :input, [tabindex]');
    }
});

// INIT AFTER PAGELOAD
$(initStuff);