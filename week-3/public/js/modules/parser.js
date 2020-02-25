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

// Only return the tracks of the artist searched for
function filterTracks(tracks, artistId, filteredTracks = []) {

    // Loop over every track 
    tracks.map((track) => {

        // Determine of the track contains an array of all the artists relevant for a track
        if (track && Array.isArray(track.artists)) {

            // Check if the passed parameter (artistID) is part of the artists relevant for a track
            if (track.artists.some(artist => artist.id === artistId)) {

                // Check if the track already exists in the filtered tracks array
                if (track.external_ids && track.external_ids.isrc &&
                    !filteredTracks.some(filteredTrack => filteredTrack.external_ids.isrc === track.external_ids.isrc)) {

                    filteredTracks.push(track);
                };
            };
        };
    });
    // Only return the array when it contains one or more tracks
    return filteredTracks.length > 0 ? filteredTracks : undefined;
}

export { parseTokenData, filterTracks };