import * as TemplateEngine from './template-engine.js';
import * as Api from './api.js';
import * as Parser from './parser.js';
import * as Getters from './getters.js';
import * as UserFeedback from './user-feedback.js';

const mostPopularTracks = document.getElementById("most-popular-tracks");

async function setMostPopularTracks(artistId) {
    try {
        UserFeedback.startLoadingFeedback();
        // No artistId was given. This means there can not be searched for an artist
        if (!artistId)
            throw "Could not search tracks for artist";

        UserFeedback.setLoadingFeedbackTitle("Getting token");
        UserFeedback.setLoadingFeedbackText("");
        const token = await Getters.getToken();

        if (!token)
            throw "Token could not be set";

        UserFeedback.setLoadingFeedbackTitle("Fetching artist");
        UserFeedback.setLoadingFeedbackText("");
        // Fetch the artist's information
        const artist = await Api.fetchArtistNameById(artistId, token);
        if (!artist)
            throw "Artist's information could not be loaded";

        UserFeedback.setLoadingFeedbackTitle("Fetching albums");
        UserFeedback.setLoadingFeedbackText("");
        // Fetch the albums
        let albums = await Getters.getAllAlbums(artistId, token);
        if (!albums)
            throw "Artist's albums could not be loaded";

        let albumIds = Parser.getAlbumIds(albums);
        if (!albumIds)
            throw "Albums Ids did not parse successfully";

        const albumsWithTrackInfoCallLimit = 20;
        const albumsWithTrackInfoCallType = "albums";

        UserFeedback.setLoadingFeedbackTitle("Fetching tracks");
        UserFeedback.setLoadingFeedbackText("");
        // Fetch the albums with simplified track information
        const albumsWithTrackInfo = await Getters.getItemsWithCallLimit(albumIds, albumsWithTrackInfoCallLimit, albumsWithTrackInfoCallType, token);
        if (!albumsWithTrackInfo)
            throw "Artist's albums with detailed track info could not be loaded";

        UserFeedback.setLoadingFeedbackText("");
        const parsedAlbumsWithTrackInfo = Parser.filterTracksFromAlbums(albumsWithTrackInfo);
        if (!parsedAlbumsWithTrackInfo)
            throw "Albums with track info did not parse successfully";

        // Filter out the tracks not made by the artist
        const simplifiedTracksOnlyFromArtist = Parser.filterRelevantTracks(parsedAlbumsWithTrackInfo, artistId);
        if (!simplifiedTracksOnlyFromArtist)
            throw "Simplified track ids only from the artist did not parse successfully";

        // Get a list of all the track ids
        const simplifiedTrackIds = Parser.getTrackIds(simplifiedTracksOnlyFromArtist);
        if (!simplifiedTrackIds)
            throw "Simplified track ids did not parse successfully";

        const fullInfoTracksCallLimit = 50;
        const fullInfoTracksCallType = "tracks";

        UserFeedback.setLoadingFeedbackTitle("Fetching tracks");
        UserFeedback.setLoadingFeedbackText("");
        // Fetch the tracks with detailed information
        const fullInfoTracks = await Getters.getItemsWithCallLimit(simplifiedTrackIds, fullInfoTracksCallLimit, fullInfoTracksCallType, token);
        if (!fullInfoTracks)
            throw "Artist's tracks with detailed track info could not be loaded";

        UserFeedback.setLoadingFeedbackText("");
        const sortedFullInfoTracksByPopularity = Parser.sortTracksByPopularity(fullInfoTracks);
        if (!sortedFullInfoTracksByPopularity)
            throw "Sorting tracks by popularity did not went successful";

        const parsedFullInfoTracks = Parser.filterDuplicateTracks(sortedFullInfoTracksByPopularity);
        if (!parsedFullInfoTracks)
            throw "Tracks with full info did not parse successfully";

        // Fill in and get the template with the search results
        const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(parsedFullInfoTracks);
        if (!mostPopularTracksHtml)
            throw "Could not load results in list";

        // Fill the options in the list with results
        mostPopularTracks.innerHTML = mostPopularTracksHtml;

        UserFeedback.stopLoadingFeedback(`${sortedFullInfoTracksByPopularity.length} tracks loaded for:`, artist, false);
    } catch (error) {
        UserFeedback.stopLoadingFeedback(error, "", true);
    }
}



export { setMostPopularTracks };