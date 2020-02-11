function getArtistSearchResultsTemplate(artists) {
    if (!Array.isArray(artists)) return

    let html = "";

    artists.map(artist => html +=
        `<a class="artist-item" href=#${artist.id}>
            <img class="artist-picture" src=${artist.images[0] ? artist.images[0].url : ""} />
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
export { getArtistSearchResultsTemplate }