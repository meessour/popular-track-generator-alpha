function parseTokenData(tokenData) {
    if (tokenData && tokenData.access_token && tokenData.expires_in) {
        return {
            accessToken: tokenData.access_token,
            expiresIn: tokenData.expires_in
        };
    };
    console.log("One or more response items related to the token are undefined");

    return;
}

// Filters out every album that is a compilation
function filterAlbumCompilations(albums) {
    const filteredAlbums = []

    albums.map((album) => {
        // Check if the album type is a compilation
        if (album && album.album_type !== "compilation") {
            filteredAlbums.push(album);
        };
    });

    return filteredAlbums.length ? filteredAlbums : undefined;
}

// Return all the ids of the albums
function getAlbumIds(albums) {
    const albumIds = []

    albums.map((album) => {
        // Check if the album has an id
        if (album && album.id) {
            albumIds.push(album.id);
        };
    });

    return albumIds.length ? albumIds : undefined;
}

// Return all the ids of the tracks
function getTrackIds(tracks) {
    const trackIds = []

    tracks.map((track) => {
        // Check if the track has an id
        if (track && track.id) {
            trackIds.push(track.id);
        };
    });

    return trackIds.length ? trackIds : undefined;
}


function filterTracksFromAlbums(albums) {
    const allTracks = []

    albums.map((album) => {
        // Check if the album contains tracks
        if (album && album.tracks && album.tracks.items) {
            allTracks.push.apply(allTracks, album.tracks.items);
        };
    });

    return allTracks.length ? allTracks : undefined;
}

// Only return the tracks of the artist searched for
function filterRelevantTracks(tracks, artistId) {
    const filteredTracks = []

    tracks.map((track) => {
        // Check if the track is made by the artist
        if (track && Array.isArray(track.artists) &&
            track.artists.some(track => track.id === artistId)) {
            filteredTracks.push(track);
        };
    });
    // Only return the array when it contains one or more tracks
    return filteredTracks.length ? filteredTracks : undefined;
}

// Remove duplicate tracks from the list
function filterDuplicateTracks(tracks) {
    const filteredTracks = []

    tracks.map((track) => {
        // Check if the track already exists in the filtered tracks array
        if (track.external_ids && track.external_ids.isrc &&
            !filteredTracks.some(filteredTrack => filteredTrack.external_ids.isrc === track.external_ids.isrc)) {

            filteredTracks.push(track);
        };
    });
    // Only return the array when it contains one or more tracks
    return filteredTracks.length ? filteredTracks : undefined;
}

function sortTracksByPopularity(tracks) {
    // From: https://stackoverflow.com/a/1129270
    return tracks.sort((a, b) => (a.popularity < b.popularity) ? 1 : ((b.popularity < a.popularity) ? -1 : 0));
}

export { parseTokenData, filterAlbumCompilations, getAlbumIds, getTrackIds, filterTracksFromAlbums, filterRelevantTracks, filterDuplicateTracks, sortTracksByPopularity };