# hatebu-pwa [![Build Status](https://travis-ci.org/azu/hatebu-pwa.svg?branch=master)](https://travis-ci.org/azu/hatebu-pwa)


Hatena Bookmark search app.

## Feature

- Support offline
- Work as HomeScreen app
- Search your hatena bookmark

## Usage

Open <https://hatebupwa.netlify.com/>


## Architecture

### Routing

- `/`
- `/home/`
    - HomeScreen app start url
    - Redirect to last used session
- `/user/:name`
    - Set user to session
