# What's Next
> A "thanks for applying" microsite for the Registrar's Office

[![NPM Version][npm-image]][npm-url]

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
