# Spotify Artists Best-Of Showcase

## Live Demo's

[Week 1](https://meessour.github.io/web-app-from-scratch-1920/week-1)

## Functionalities

The main functionality of the app is displaying the most popular tracks of an artists. [Spotify](https://www.spotify.com/) currently has this feature implemented, but with limitations. Spotify only showcases the top 10 most popular tracks of an artist on their page. This app also showcases the most popluar tracks, but without the limitation of 10 tracks.

![Overview](img\camo_krooked_most_popluar.png)

## Actor diagram
 
<details>
<summary>Actor diagram</summary>

![Actor diagram](../)
</details>

## API

[The Spotify Web API](https://developer.spotify.com/documentation/web-api/) Based on simple REST principles, the Spotify Web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue.
<br/>
There aren't any restrictions mentioned in the docs of REST Countries.

## Usage

```bash
git clone https://github.com/meessour/web-app-from-scratch-1920.git
```

## Interaction dsiagram
 
<details>
<summary>Interaction dsiagram</summary>

![Interaction dsiagram](../)
</details>

## Best practices & Design patterns
Best practices:
- ~~Strict mode~~ (not needed with ES6 modules)
- Constants instead of variables
- CamelCase
- Line length under 80
- End statements with semicolon
- Avoid else, return early
- Single quotes for strings

Design patterns:
+ ~~IIFE~~ (not needed with ES6 modules)
+ Proxy pattern for time-based cache
+ Template method pattern for rendering pages

## Wishlist

- [ ] Search on artist
- [ ] Show top tracks of artist
- [ ] Display artist's information
- [ ] Generate playlist with all the most populuar tracks

## Licence
MIT © [Mees Sour](https://github.com/meessour)