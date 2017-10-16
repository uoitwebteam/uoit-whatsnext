((exports => {

  const MS_IN_MINUTES = 60 * 1000;

  const calendarGenerators = {
    google(event) {
      const startTime = formatTime(event.start);
      const endTime = calculateEndTime(event);

      const href = encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        `&text=${event.title || ''}`,
        `&dates=${startTime || ''}`,
        `/${endTime || ''}`,
        `&details=${event.description || ''}`,
        `&location=${event.address || ''}`,
        '&sprop=&sprop=name:'
      ].join(''));
      return `<a class="icon-google" target="_blank" href="${href}">Google Calendar</a>`;
    },

    yahoo(event) {
      const eventDuration = event.end ?
        ((event.end.getTime() - event.start.getTime())/ MS_IN_MINUTES) :
        event.duration;

      // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
      const yahooHourDuration = eventDuration < 600 ?
        `0${Math.floor((eventDuration / 60))}` :
        `${Math.floor((eventDuration / 60))}`;

      const yahooMinuteDuration = eventDuration % 60 < 10 ?
        `0${eventDuration % 60}` :
        `${eventDuration % 60}`;

      const yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

      // Remove timezone from event time
      const st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() *
                                                  MS_IN_MINUTES))) || '';

      const href = encodeURI([
        'http://calendar.yahoo.com/?v=60&view=d&type=20',
        `&title=${event.title || ''}`,
        `&st=${st}`,
        `&dur=${yahooEventDuration || ''}`,
        `&desc=${event.description || ''}`,
        `&in_loc=${event.address || ''}`
      ].join(''));

      return `<a class="icon-yahoo" target="_blank" href="${href}">Yahoo! Calendar</a>`;
    },

    ics(event, eClass, calendarName) {
      const startTime = formatTime(event.start);
      const endTime = calculateEndTime(event);

      const href = encodeURI(
        `data:text/calendar;charset=utf8,${[
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'URL:' + document.URL,
  'DTSTART:' + (startTime || ''),
  'DTEND:' + (endTime || ''),
  'SUMMARY:' + (event.title || ''),
  'DESCRIPTION:' + (event.description || ''),
  'LOCATION:' + (event.address || ''),
  'END:VEVENT',
  'END:VCALENDAR'].join('\n')}`);

      return `<a class="${eClass}" target="_blank" href="${href}">${calendarName}</a>`;
    },

    ical(evnt) {
      return this.ics(evnt, 'icon-ical', 'iCal');
    },

    outlook(evnt) {
      return this.ics(evnt, 'icon-outlook', 'Outlook');
    }
  };

  function formatTime(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  function calculateEndTime(event) {
    return event.end ?
      formatTime(event.end) :
      formatTime(new Date(event.start.getTime() + (event.duration * MS_IN_MINUTES)));
  };

  function generateCalendars(evnt) {
    return {
      google: calendarGenerators.google(evnt),
      yahoo: calendarGenerators.yahoo(evnt),
      ical: calendarGenerators.ical(evnt),
      outlook: calendarGenerators.outlook(evnt)
    };
  };

  // Make sure we have the necessary event data, such as start time and event duration
  // TODO: have this return what's missing
  function validParams(params) {
    if (params == undefined) { return 'options' }
    if (!params.start) { return 'start time' }
    if (params.end == undefined && params.duration == undefined) { return 'end time' }
    return true
  };

  function generateMarkup(calendars, text) {
    const result = document.createElement('div');
    const id = Math.floor(Math.random() * 1000000);

    result.innerHTML = `<label for="checkbox-for-${id}" class="add-to-calendar-checkbox"><span class="ion-plus-circled"></span> &nbsp;Add to calendar</label>`;
    result.innerHTML += `<input name="add-to-calendar-checkbox" class="add-to-calendar-checkbox" id="checkbox-for-${id}" type="checkbox">`;

    Object.keys(calendars).forEach(services => {
      result.innerHTML += calendars[services];
    });

    return result;
  };

  // the main event
  function addToCalendar(params) {

    const valid = validParams(params);
    if (typeof valid === 'string') {
      const msg = `ERROR: ${valid} missing`;
      const err = document.createElement('div');
      err.innerHTML = msg;
      err.style.color = 'red';
      console.log(msg);
      return err
    }

    addCSS();
    return generateMarkup(generateCalendars(params), params.text);
  };

  // expose public api
  exports.addToCalendar = addToCalendar;

  function addCSS(){

    // first, make sure the css hasn't already been added
    if (document.querySelector('#ouical-css')) { return }

    // yep this is a pain, but not sure there's another way to do it
    // i think the best option would be to have grunt auto-update this variable
    // on build, which I'm not sure is possible at the moment
    const css = '#add-to-calendar-checkbox-label{cursor:pointer}.add-to-calendar-checkbox~a{display:none}.add-to-calendar-checkbox:checked~a{display:block;width:100%;}label.add-to-calendar-checkbox{font-family:franklin_gothic_fsdemi;font-weight:normal;}.add-to-calendar-checkbox~a:before{width:16px;height:16px;display:inline-block;font-family:\'Ionicons\';margin-right:.5em;}.icon-ical:before{content: \'\f117\';}.icon-outlook:before{content: \'\f2d1\';}.icon-yahoo:before{content: \'\f24b\';}.icon-google:before{content: \'\f34f\';}';

    // add styles to the head
    const style_tag = document.createElement('style');
    style_tag.id = 'ouical-css';
    style_tag.innerHTML = css;
    document.querySelector('head').appendChild(style_tag);
  }

}))(window);