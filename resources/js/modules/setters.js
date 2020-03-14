import * as TemplateEngine from './template-engine.js';
import * as Api from './api.js';
import * as Parser from './parser.js';
import * as Getters from './getters.js';
import * as UserFeedback from './user-feedback.js';

const mostPopularTracks = document.getElementById("most-popular-tracks");

// The amount that spotify allows to fetch in one time for albums
const albumsWithTrackInfoCallLimit = 20;
const albumsWithTrackInfoCallType = "albums";

// The amount that spotify allows to fetch in one time for tracks
const fullInfoTracksCallLimit = 50;
const fullInfoTracksCallType = "tracks";

async function setMostPopularTracks(artistId) {
    try {
        // No artistId was given. This means there can not be searched for an artist
        if (!artistId)
            throw "Could not search tracks for artist";

        // Show the snackbar notification with the progress
        UserFeedback.startLoadingFeedback();

        const token = await Getters.getToken();

        // Fetch the artist's information
        const artist = await Api.fetchArtistNameById(artistId, token);
        if (!artist)
            throw "Artist's information could not be loaded";

        // Fetch the albums
        let albums = await Getters.getAllAlbums(artistId, token);

        let albumIds = Parser.getAlbumIds(albums);

        // Fetch the albums with simplified track information
        const albumsWithTrackInfo = await Getters.getItemsWithCallLimit(albumIds, albumsWithTrackInfoCallLimit, albumsWithTrackInfoCallType, token);

        const parsedAlbumsWithTrackInfo = Parser.filterTracksFromAlbums(albumsWithTrackInfo);

        // Filter out the tracks not made by the artist
        const simplifiedTracksOnlyFromArtist = Parser.filterRelevantTracks(parsedAlbumsWithTrackInfo, artistId);

        // Get a list of all the track ids
        const simplifiedTrackIds = Parser.getTrackIds(simplifiedTracksOnlyFromArtist);
        // Fetch the tracks with detailed information
        const fullInfoTracks = await Getters.getItemsWithCallLimit(simplifiedTrackIds, fullInfoTracksCallLimit, fullInfoTracksCallType, token);

        const sortedFullInfoTracksByPopularity = Parser.sortTracksByPopularity(fullInfoTracks);

        const parsedFullInfoTracks = Parser.filterDuplicateTracks(sortedFullInfoTracksByPopularity);

        // Fill in and get the template with the search results
        const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(parsedFullInfoTracks);

        // Fill the options in the list with results
        mostPopularTracks.innerHTML = mostPopularTracksHtml;

        UserFeedback.stopLoadingFeedback(`${parsedFullInfoTracks.length} tracks loaded for:`, artist, false);
    } catch (error) {
        console.log("error:", error);
        
        UserFeedback.stopLoadingFeedback(error, "", true);
    }
}

export { setMostPopularTracks };