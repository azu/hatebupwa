# hatebupwa [![Build Status](https://travis-ci.org/azu/hatebupwa.svg?branch=master)](https://travis-ci.org/azu/hatebupwa)

Hatena Bookmark search app.

## Feature

- Search your hatena bookmark
- Fetch difference bookmark automatically
- Support offline search
    - Safari 11.3+, Chrome, Firefox and MSEdge etc...
- Work as HomeScreen app

## Usage

Open <https://hatebupwa.netlify.com/>

### Install as App

- iOS: "Add HomesScreen" on <https://hatebupwa.netlify.com/>
- Android: "Add HomeScreen" on <https://hatebupwa.netlify.com/>
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
