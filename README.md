# hatebupwa [![Build Status](https://travis-ci.org/azu/hatebupwa.svg?branch=master)](https://travis-ci.org/azu/hatebupwa)

Hatena Bookmark search app.

## Feature

- Search your hatena bookmark
- Fetch difference bookmark automatically
- Support offline search
    - Safari 11.3+, Chrome, Firefox and MSEdge etc...
- Work as HomeScreen app

## Usage

1. Open <https://hatebupwa.netlify.app/>
2. Input hatena user name
3. Search


For [asocial-bookmark](https://github.com/azu/asocial-bookmark) user

1. Open <https://hatebupwa.netlify.app/>
2. Input `https://your-bookmark.example.com/index.json` to hatenagit  user name
    - Support root index.json file as user name
3. Search

### Install as App

- iOS: "Add HomesScreen" on <https://hatebupwa.netlify.app/>
- Android: "Add HomeScreen" on <https://hatebupwa.netlify.app/>
- mac: Download from <https://github.com/azu/hatebupwa/releases/latest>
- other platform: Run following commands:

```
git clone https://github.com/azu/hatebupwa
cd hatebupwa
yarn
yarn run pacakge
# generate https://github.com/jiahaog/nativefier based app
```

## Architecture

### Routing

- `/`
    - Start
- `/home/`
    - `start_url` of HomeScreen app 
    - Redirect to last used session
- `/user/:name`
    - Set user to session
