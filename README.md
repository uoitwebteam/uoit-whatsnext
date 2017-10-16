# What's Next
> A "thanks for applying" microsite for the Registrar's Office

This microsite accompanies yearly mail-outs for prospective students that have applied to UOIT. The mailer directs prospectives to the microsite, where they are thanked for their application and given next steps.

![Screenshot of uoit.ca/whatsnext](screenshot.png)

## Installation

```sh
git clone git@github.com:uoitwebteam/uoit-whatsnext.git
cd uoit-whatsnext && npm install & bower install
```

## Development setup

To develop locally, use a webserver that supports PHP (like an *AMP server) to serve files from this project's `dist` directory and use:

```sh
npm run start
```

...to watch for file changes and rebuild to the distribution.

## Making content edits

### All pages:

* make edits in the `app` directory only (not `dist`)
* most "main" content is written directly inside `index.php`
* to write content for only one level (101 and 105) use PHP and the `level` query parameter:
  ```php
  <?php if (isset($_GET['level']) && $_GET['level'] === '105') echo 'Shows on 105 only!'; ?>
  ```

### Third (calendar) page:
* each level has two additional files to render this page:
  - <code>inc/<strong>[level]</strong>cal.php</code>
  - <code>data/<strong>[level]</strong>.json</code>
* files inside `inc` folder are for rendering layout/HTML for this page and level
* files inside `data` are JSON definitions that differ in structure slightly; used to generate "add to calendar" buttons for each calendar item
* **both files need to be updated** when this section changes because their information changes tone in the context of a calendar event. Examples:
  - a link that says "Click here to register" will need to be changed to "Visit http://the.link to register"
  - a title that says "Deadline to submit completed applications to the Ontario Universities' Application Centre (OUAC)" could be shortened to "OUAC application deadline"

### Fifth (Twitter feed) page:
* feed is generated inside `feed.php`
* contains API keys, user ID to point feed towards, and markup for feed layout
