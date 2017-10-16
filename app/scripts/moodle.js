(exports => {

  const FOCUSABLE = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ` ${className}`;
    }
  }

  // fade out
  function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }
  // fade in
  function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  function trapEscapeKey(evt, cb) {
    // if escape pressed
    if (evt.which == 27) {
      evt.preventDefault();
      cb();
    }
  }

  function trapMetaKey(evt, cb) {
    // if ctrl+i or ⌘+i pressed
    if ((evt.ctrlKey || evt.metaKey) && evt.which == 73) {
      evt.preventDefault();
      cb();
    }
  }

  class Moodle {
    constructor(moodle, {
      page,
      overlay
    } = '') {
      // check for required stuff
      if (!moodle) {
        throw new Error('No element to Moodlize!');
      }
      if (!page || !overlay) {
        throw new Error('Missing required element IDs!');
      }

      // assign elements if they're around
      this.moodle = document.querySelector(moodle);
      this.page = document.querySelector(page);

      // give the overlay some style
      this.overlay = document.querySelector(overlay);
      addClass(this.overlay, 'moodle-overlay');

      // check for a close button, give it some style
      if (document.getElementById('moodle-close')) {
        this.closeButton = document.getElementById('moodle-close');
        addClass(this.closeButton, 'moodle-close');
      } else {
        this.moodle.insertAdjacentHTML(
          'beforeend',
          '<button id="moodle-close" title="Close window" class="moodle-close">×</button>'
        );
        this.closeButton = document.getElementById('moodle-close');
        this.closeButton.insertAdjacentHTML(
          'afterbegin',
          '<span class="sr-label">Pressing return or escape will close this dialog and return focus to the main content</span>'
        );
      }
      // listen for keydown events on the whole document
      // scoop relevant keycodes for callbacking
      document.addEventListener('keydown', event => {
        trapEscapeKey(event, () => {
          this.hide()
        });
        trapMetaKey(event, () => {
          this.show();
        });
      });
    }
    show() {
      // insert an overlay to prevent clicking
      // make a visual change to indicate the main page is unavailable
      fadeIn(this.overlay);
      this.moodle.style.display = 'block';
      // make the moodle visible and main page hidden
      this.moodle.setAttribute('aria-hidden', 'false');
      this.page.setAttribute('aria-hidden', 'true');

      // save current focus and set to moodle
      this.lastFocusedItem = $(':focus');
      this.focusFirstItem(this.moodle);

      // attach a listener to redirect the tab to the moodle if the user somehow gets out
      this.page.addEventListener('focusin', () => {
        this.focusFirstItem();
      });

      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => {
          this.hide();
        });
      }
    }
    hide() {
      // remove the overlay and make the main screen available again
      fadeOut(this.overlay);
      this.moodle.style.display = 'none';
      // mark the modal window as hidden and the main page as visible
      this.moodle.setAttribute('aria-hidden', 'true');
      this.page.setAttribute('aria-hidden', 'false');

      // set focus back to element that had it before the modal was opened
      this.lastFocusedItem.focus();

      // remove the listener which redirects tab keys in the main content area to the modal
      this.page.removeEventListener('focusin', () => {
        this.focusFirstItem();
      });
      // remove close button listener
      if (this.closeButton) {
        this.closeButton.removeEventListener('click', () => {
          this.hide();
        });
      }
    }
    focusFirstItem() {
      // set the focus to the first keyboard focusable item
      this.moodle.querySelector(FOCUSABLE).focus();
    }
  }

  exports.Moodle = Moodle;
})(window);
