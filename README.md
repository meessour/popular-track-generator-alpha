# Spotify Artists Best-Of Showcase

![Preview](img\website-preview.png)

## Live Demo's

[Week 1](https://meessour.github.io/web-app-from-scratch-1920/week-1/)

[Week 2](https://meessour.github.io/web-app-from-scratch-1920/week-2/)

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

```bash
git clone https://github.com/meessour/web-app-from-scratch-1920.git
```

## Interaction diagram
 
<details>
<summary>Interaction diagram</summary>

![Interaction diagram](../)
</details>

## Best practices & Design patterns

## Wishlist

## Licence
MIT © [Mees Sour](https://github.com/meessour)