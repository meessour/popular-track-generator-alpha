# Spotify Artists Best-Of Showcase
## Previews and live demo's

<details>
<summary>Week 1 preview</summary>

![Preview](./img/website-preview-week-1.png)
</details>

<details>
<summary>Week 2 preview</summary>

![Preview](./img/website-preview-week-2.png)
</details>

[Week 3 Demo](https://meessour.github.io/web-app-from-scratch-1920/week-3/)
<details>
<summary>Week 3 preview</summary>

![Preview](./img/website-preview-week-3.png)
</details>

## Functionalities

The main functionality of the app is displaying the most popular tracks of an artists. [Spotify](https://www.spotify.com/) currently has this feature implemented, but with limitations. Spotify only showcases the top 10 most popular tracks of an artist on their page. This app also showcases the most popluar tracks, but without the limitation of 10 tracks.
<details>
<summary>Click here to show example</summary>

![Overview](./img/camo_krooked_most_popluar.png)
</details>

## Actor diagram
 
<details>
<summary>Actor diagram (Week 2)</summary>

![Actor diagram](./img/actor-diagram-week-2.png)
</details>

<details>
<summary>Actor diagram (Week 3)</summary>

![Actor diagram](./img/actor-diagram-week-3.png)
</details>

## Interaction diagram
<details>
<summary>Click here to show the interaction diagram</summary>

![Interaction diagram](./img/interaction-diagram.png)
</details>

## API

[The Spotify Web API](https://developer.spotify.com/documentation/web-api/) Based on simple REST principles, the Spotify Web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue.
<br/>
There aren't any restrictions mentioned in the docs of REST Countries.

Here is the format in which the API returns it's data (fetching artists by search query in string format):
```json
{
  "artists" : {
    "href" : "",
    "items" : [ {
      "id" : "",
      "name" : "",
     ] },
  }
}
```

## Usage

Clone the project
```bash
git clone https://github.com/meessour/web-app-from-scratch-1920.git
```

Install the http-server package
```bash
npm i -g http-server
```

Run local server
```bash
hs
```

## Wishlist
- [ ] Filter for excluding/including (re)mixes, radio edits, live performances, extended versions, features, remastered versions, album versions, etc.

- [ ] Let the user choose how many tracks need to be shown
- [ ] Create playlist of all the tracks
- [ ] Replace the original generated playlist by the newly looked up artist
- [ ] Let the user choose between "create new playlist" and "replace old one"
- [ ] A better way of hiding the token

- [ ] Light weight web player that only works if musix plays on external device. Controllable by media keys

## Licence
MIT © [Mees Sour](https://github.com/meessour)
