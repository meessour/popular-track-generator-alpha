import * as TemplateEngine from './modules/template-engine.js';
import * as Api from './modules/api.js';
import * as Parser from './modules/parser.js';
import * as LocalStorage from './modules/local-storage.js';

// Routie, a library used for handling routing
import './libs/routie.min.js';

const artistsNameInput = document.getElementById("artist-name-input");
const searchResult = document.getElementById("search-result");
const mostPopularTracks = document.getElementById("most-popular-tracks");
const userFeedbackContainer = document.getElementById("user-feedback-container");
const userFeedbackText = document.getElementById("user-feedback-text");
const printInfoButton = document.getElementById("print-info-button");

artistsNameInput.addEventListener("input", function () {
    const input = artistsNameInput.value

    // Check if input is not empty
    if (isString(input)) {
        searchArtistInput(input);
    } else {
        clearSearchBar()
        clearSearchResults()
    }
});

// printInfoButton.addEventListener("onclick", function () {
//     console.log("Clicke don button");

// })

// check if value is a valid string with content
function isString(value) {
    return value && value !== "" && value.length > 0 && value.trim().length > 0
}

routie(':id', function (id) {
    setMostPopularTracks(id)
    clearSearchBar()
    clearSearchResults()
});

async function setMostPopularTracks(artistId) {
    try {
        // No artistId was given. This means there can not be searched for an artist
        if (!artistId)
            throw "Could not search tracks for artist";

        const token = await getToken();

        if (!token)
            throw "Token could not be set";

        // Fetch the artist's information
        const artist = await Api.fetchArtistNameById(artistId, token);
        if (!artist)
            throw "Artist's information could not be loaded";

        // Fetch the albums
        let albums = await getAllAlbums(artistId, token);
        if (!albums)
            throw "Artist's albums could not be loaded";

        let albumIds = Parser.getAlbumIds(albums)
        if (!albumIds)
            throw "Albums Ids did not parse successfully";

        const albumsWithTrackInfoCallLimit = 20
        const albumsWithTrackInfoCallType = "albums"

        // Fetch the albums with simplified track information
        const albumsWithTrackInfo = await getItemsWithCallLimit(albumIds, albumsWithTrackInfoCallLimit, albumsWithTrackInfoCallType, token)
        if (!albumsWithTrackInfo)
            throw "Artist's albums with detailed track info could not be loaded";

        const parsedAlbumsWithTrackInfo = Parser.filterTracksFromAlbums(albumsWithTrackInfo)
        if (!parsedAlbumsWithTrackInfo)
            throw "Albums with track info did not parse successfully";

        // Filter out the tracks not made by the artist
        const simplifiedTracksOnlyFromArtist = Parser.filterRelevantTracks(parsedAlbumsWithTrackInfo, artistId)
        if (!simplifiedTracksOnlyFromArtist)
            throw "Simplified track ids only from the artist did not parse successfully";

        // Get a list of all the track ids
        const simplifiedTrackIds = Parser.getTrackIds(simplifiedTracksOnlyFromArtist)
        if (!simplifiedTrackIds)
            throw "Simplified track ids did not parse successfully";

        const fullInfoTracksCallLimit = 50
        const fullInfoTracksCallType = "tracks"

        // Fetch the tracks with detailed information
        const fullInfoTracks = await getItemsWithCallLimit(simplifiedTrackIds, fullInfoTracksCallLimit, fullInfoTracksCallType, token)
        if (!fullInfoTracks)
            throw "Artist's tracks with detailed track info could not be loaded";

        const sortedFullInfoTracksByPopularity = Parser.sortTracksByPopularity(fullInfoTracks)
        if (!sortedFullInfoTracksByPopularity)
            throw "Sorting tracks by popularity did not went successful";

        const parsedFullInfoTracks = Parser.filterDuplicateTracks(sortedFullInfoTracksByPopularity)
        if (!parsedFullInfoTracks)
            throw "Tracks with full info did not parse successfully";

        // Fill in and get the template with the search results
        const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(parsedFullInfoTracks);
        if (!mostPopularTracksHtml)
            throw "Could not load results in list";

        // setUserFeedback("Showing results for " + artist, false)
        setUserFeedback(`${sortedFullInfoTracksByPopularity.length} most popular tracks loaded for: ${artist}`, false)

        // Fill the options in the list with results
        mostPopularTracks.innerHTML = mostPopularTracksHtml;


    } catch (error) {
        setUserFeedback(error)
    }

    // 


}



async function getAllAlbums(artistId, token) {
    try {
        // Fetch the albums of an artist
        const firstFetchResponse = await Api.fetchAlbumsByArtistId(token, artistId)
        if (!firstFetchResponse)
            throw "Spotify services didn't return anything"

        // The items represent the albums of the artist
        const allLoadedAlbums = firstFetchResponse.items

        // Set the url needed to fetch more albums of the artist (it can be that all albums have been fetched already)
        let nextUrl = firstFetchResponse.next

        if (!Array.isArray(allLoadedAlbums) && allLoadedAlbums.length)
            throw "Artist's albums could not be loaded";

        // Fetch more albums until the response doesn't return any anymore
        while (nextUrl) {
            const fetchResponse = await Api.fetchByUrl(token, nextUrl)
            if (!fetchResponse)
                throw "Spotify services didn't return anything";

            const albums = fetchResponse.items
            nextUrl = fetchResponse.next

            // Add the newly loaded in albums to the already existing list
            allLoadedAlbums.push.apply(allLoadedAlbums, albums);
        }

        return allLoadedAlbums
    } catch (error) {
        setUserFeedback(error);
    }
}

// Used to fetch items where the API has a limit on items it can handle in the header
async function getItemsWithCallLimit(itemIds, limit, itemType, token) {
    try {
        // Check if the list has items 
        if (!Array.isArray(itemIds) || !itemIds.length)
            throw "No items were found";

        const allItems = []

        // The amount of calls that need to be made 
        const amountOfCalls = Math.ceil(itemIds.length / limit)

        for (let i = 0; i < amountOfCalls; i++) {
            const start = i * limit
            const end = (i * limit) + limit

            // list containing not more than the given item limit
            const trimmedList = itemIds.slice(start, end);

            // A list containing ids seperated by commas
            const trimmedListString = trimmedList.toString();

            let fetchedItems = await Api.fetchItemsByItemIds(token, itemType, trimmedListString)
            if (!fetchedItems)
                throw "Items of type " + itemType + " could not be fetched";

            if (itemType === "albums") {
                allItems.push.apply(allItems, fetchedItems.albums);
            } else if (itemType === "tracks") {
                allItems.push.apply(allItems, fetchedItems.tracks);
            } else {
                throw "Unknown itemType";
            }
        }

        if (!Array.isArray(allItems) || !allItems.length)
            throw "No items were found";

        return allItems;
    } catch (error) {
        setUserFeedback(error);
        return;
    }
}



async function searchArtistInput(input) {
    try {
        const token = await getToken();
        if (!token)
            throw "Token could not be set";

        // Fetch the artists from the API
        const artists = await Api.fetchArtists(input, token)
        if (!artists)
            throw "Artist's could not be loaded";

        // Fill in and get the template with the search results
        const searchResultsHtml = TemplateEngine.getArtistSearchResultsTemplate(artists);

        if (!searchResultsHtml) {
            clearSearchResults();
            throw "Artist's could not be loaded";
        }

        // Fill the options in the list with results
        searchResult.innerHTML = searchResultsHtml;
    } catch (error) {
        setUserFeedback(error);
    }
}

async function getToken() {
    // Get the token form the local storage
    const token = await LocalStorage.getTokenFromLocalStorage();

    // If a token was found in the local storage, return it
    if (token)
        return token;

    // Fetch the token
    const newTokenData = await Api.fetchToken()
    if (!newTokenData)
        throw "Could not fetch the token from Spotify"

    const parsedNewTokenData = Parser.parseTokenData(newTokenData)
    if (!parsedNewTokenData)
        throw "Could not parse the fetched token"

    const parsedNewToken = parsedNewTokenData.accessToken;
    const parsedNewTokenExpiration = parsedNewTokenData.expiresIn;

    if (!parsedNewToken || !parsedNewTokenExpiration)
        throw "Parsed token missed some data"

    LocalStorage.setTokenInLocalStorage(parsedNewToken, parsedNewTokenExpiration)

    return parsedNewToken;
}

// Show a snackbar looking feedback message. Standard message type is an error, unless told otherwise
function setUserFeedback(message, isError = true) {
    if (isError)
        console.error(message);

    // Set container color either the error or success color
    isError ?
        userFeedbackContainer.classList.add("error-color") :
        userFeedbackContainer.classList.add("success-color");

    // Set the user feedback
    userFeedbackText.innerHTML = message;

    // Show user feedback
    userFeedbackContainer.classList.add("show-user-feedback");

    // Show the feedback notification for 1.75 seconds
    setTimeout(function () {
        userFeedbackContainer.classList.remove("error-color")
        userFeedbackContainer.classList.remove("success-color")
        userFeedbackContainer.classList.remove("show-user-feedback")

        userFeedbackText.innerHTML = ""
    }, 1750);

}

function clearSearchBar() {
    artistsNameInput.value = "";
}

function clearSearchResults() {
    searchResult.innerHTML = "";
}