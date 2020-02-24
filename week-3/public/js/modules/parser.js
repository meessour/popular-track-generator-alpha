function parseTokenData(tokenData) {
    if (tokenData && tokenData.access_token && tokenData.expires_in) {
        return {
            accessToken: tokenData.access_token,
            expiresIn: tokenData.expires_in
        }
    }
    console.log("One or more response items related to the token are undefined");

    return
}

// Only return the tracks of the artist searched for
function filterTracks(tracks, artistId) {

    let filteredTracks = []

    tracks.map((track, index) => {
        if (track && track.artists && track.artists.id && track.artists.id === artistId) {
            filteredTracks.push(track)
        }
    });

    return filteredTracks.length > 0 ? filteredTracks : undefined
}

export { parseTokenData, filterTracks }