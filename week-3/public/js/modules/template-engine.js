function getArtistSearchResultsTemplate(artists) {
    if (!Array.isArray(artists)) return

    let html = "";

    artists.map(artist => html +=
        `<a class="artist-item" href=#${artist.id}>
            <img class="artist-picture" src=${artist.images[0] ? artist.images[(artist.images.length - 1)].url : ""} />
                <div class="artist-description">
                    <p class="artist-name">${artist.name}</p>
                        <div class="followers">
                            <img class="followers-icon" src="../img/group-of-people.svg">
                            <p class="artist-followers">${artist.followers.total}</p>
                        </div>
                </div>
        </a>`
    );

    return html
}

function getMostPopularTracksTemplate(tracks) {
    if (!Array.isArray(tracks)) return

    console.log("track", tracks);


    let html = "";

    tracks.map(track => html +=
        `<a class="track-item" href=${track.external_urls.spotify}>
            <img class="track-picture" src=${track.album && track.album.images[0] ? track.album.images[(track.album.images.length - 1)].url : ""} />
                <div class="track-description">
                    <p class="track-name">${track.name}</p>
                </div>
        </a>`
    );

    return html
}
export { getArtistSearchResultsTemplate, getMostPopularTracksTemplate }