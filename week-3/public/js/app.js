import * as TemplateEngine from './modules/template-engine.js';
import * as Api from './modules/api.js';
import * as Parser from './modules/parser.js';
import * as LocalStorage from './modules/local-storage.js';

// Routie, a library used for handling routing
import './libs/routie.min.js';

const artistsNameInput = document.getElementById("artist-name-input")
const searchResult = document.getElementById("search-result")
const mostPopularTracks = document.getElementById("most-popular-tracks")
const userFeedbackContainer = document.getElementById("user-feedback-container")
const userFeedbackText = document.getElementById("user-feedback-text")

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
    if (!artistId) { setUserFeedback("Could not search tracks for artist"); return }

    const token = await getToken();
    if (!token) { setUserFeedback("Token could not be set"); return }

    // Fetch the artist's information
    let artist = await Api.fetchArtistNameById(artistId, token)
    if (!artist) { setUserFeedback("Artist's information could not be loaded"); return }

    // Fetch the albums
    let albums = await getAllAlbums(artistId, token)
    if (!albums) { setUserFeedback("Artist's albums could not be loaded"); return }

    let parsedAlbums = await Parser.filterAlbumCompilations(albums)
    if (!parsedAlbums) { setUserFeedback("Albums did not parse successfully"); return }

    let albumIds = await Parser.getAlbumIds(parsedAlbums)
    if (!albumIds) { setUserFeedback("Albums Ids did not parse successfully"); return }

    const albumsWithTrackInfoCallLimit = 20
    const albumsWithTrackInfoCallType = "albums"

    // Fetch the albums with simplified track information
    let albumsWithTrackInfo = await getItemsWithCallLimit(albumIds, albumsWithTrackInfoCallLimit, albumsWithTrackInfoCallType, token)
    if (!albumsWithTrackInfo) { setUserFeedback("Artist's albums with detailed track info could not be loaded"); return }

    let parsedAlbumsWithTrackInfo = await Parser.filterTracksFromAlbums(albumsWithTrackInfo)
    if (!parsedAlbumsWithTrackInfo) { setUserFeedback("Albums with track info did not parse successfully"); return }

    // Filter out the tracks not made by the artist
    let simplifiedTracksOnlyFromArtist = await Parser.filterRelevantTracks(parsedAlbumsWithTrackInfo, artistId)
    if (!simplifiedTracksOnlyFromArtist) { setUserFeedback("Simplified track ids only from the artist did not parse successfully"); return }

    // Get a list of all the track ids
    let simplifiedTrackIds = await Parser.getTrackIds(simplifiedTracksOnlyFromArtist)
    if (!simplifiedTrackIds) { setUserFeedback("Simplified track ids did not parse successfully"); return }

    const fullInfoTracksCallLimit = 50
    const fullInfoTracksCallType = "tracks"

    // Fetch the tracks with detailed information
    let fullInfoTracks = await getItemsWithCallLimit(simplifiedTrackIds, fullInfoTracksCallLimit, fullInfoTracksCallType, token)
    if (!fullInfoTracks) { setUserFeedback("Artist's tracks with detailed track info could not be loaded"); return }

    let parsedFullInfoTracks = await Parser.filterDuplicateTracks(fullInfoTracks)
    if (!parsedFullInfoTracks) { setUserFeedback("Tracks with full info did not parse successfully"); return }

    let sortedFullInfoTracksByPopularity = await Parser.sortTracksByPopularity(parsedFullInfoTracks)
    if (!sortedFullInfoTracksByPopularity) { setUserFeedback("Sorting tracks by popularity did not went successful"); return }

    // Fill in and get the template with the search results
    const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(sortedFullInfoTracksByPopularity);
    if (!mostPopularTracksHtml) { setUserFeedback("Could not load results in list"); return }

    // TO DO FIX TEMPALTEING PLX
    // setUserFeedback("Showing results for " + artist, false)
    setUserFeedback(`${sortedFullInfoTracksByPopularity.length} most tracks loaded for ${artist}`, false)

    // Fill the options in the list with results
    mostPopularTracks.innerHTML = mostPopularTracksHtml;
}

async function getTokenData() {
    // Fetch the token
    const tokenData = await Api.fetchToken()
    if (!tokenData) { setUserFeedback("Could not fetch token from Spotify"); return }

    // Parse the token
    const parsedToken = Parser.parseTokenData(tokenData)
    if (!parsedToken || !parsedToken.accessToken || !parsedToken.expiresIn) { setUserFeedback("Could not fetch items from Spotify"); return }

    return parsedToken
}

async function getAllAlbums(artistId, token) {
    // Fetch the albums of an artist
    const firstFetchResponse = await Api.fetchAlbumsByArtistId(token, artistId)
    if (!firstFetchResponse) { setUserFeedback("Spotify services didn't return anything"); return; }

    // The items represent the albums of the artist
    const allLoadedAlbums = firstFetchResponse.items

    // Set the url needed to fetch more albums of the artist (it can be that all albums have been fetched already)
    let nextUrl = firstFetchResponse.next

    if (!Array.isArray(allLoadedAlbums) && allLoadedAlbums.length) { setUserFeedback("Artist's albums could not be loaded"); return; }

    // Fetch more albums until the response doesn't return any anymore
    while (nextUrl) {
        const fetchResponse = await Api.fetchByUrl(token, nextUrl)
        if (!fetchResponse) { setUserFeedback("Spotify services didn't return anything"); return; }

        const albums = fetchResponse.items
        nextUrl = fetchResponse.next

        // Add the newly loaded in albums to the already existing list
        allLoadedAlbums.push.apply(allLoadedAlbums, albums);
    }

    return allLoadedAlbums
}

// Used to fetch items where the API has a limit on items it can handle in the header
async function getItemsWithCallLimit(itemIds, limit, itemType, token) {
    // Check if the list has items 
    if (!Array.isArray(itemIds) || !itemIds.length) return

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
        if (!fetchedItems) { setUserFeedback("Items of type " + itemType + " could not be fetched"); return }

        if (itemType === "albums") {
            allItems.push.apply(allItems, fetchedItems.albums);
        } else if (itemType === "tracks") {
            allItems.push.apply(allItems, fetchedItems.tracks);
        } else {
            setUserFeedback("Unknown itemType");
            return
        }
    }

    return allItems.length ? allItems : undefined
}

function setToken(tokenData) {
    if (tokenData && tokenData.accessToken && tokenData.expiresIn) {
        LocalStorage.setTokenInLocalStorage(tokenData.accessToken, tokenData.expiresIn)
    }
}

async function searchArtistInput(input) {
    const token = await getToken();
    if (!token) { setUserFeedback("Token could not be set"); return }

    // Get the artists
    const artists = await Api.fetchArtists(input, token)
    if (!artists) { setUserFeedback("Artist's could not be loaded loaded"); return }

    // Fill in and get the template with the search results
    const searchResultsHtml = TemplateEngine.getArtistSearchResultsTemplate(artists);

    if (!searchResultsHtml) {
        setUserFeedback("Could not load results"), clearSearchResults();
        return
    }

    // Fill the options in the list with results
    searchResult.innerHTML = searchResultsHtml;
}

async function getToken() {
    // Get the token
    const token = await LocalStorage.getTokenFromLocalStorage();

    if (token) {
        return token
    } else {
        const tokenRefreshState = refreshToken();
        if (!tokenRefreshState) { setUserFeedback("Token could not be set"); return }

        return await LocalStorage.getTokenFromLocalStorage();
    }
}

async function refreshToken() {
    const tokenData = await getTokenData();
    if (!tokenData) { setUserFeedback("Token could not be set while refreshing token"); return }

    setToken(tokenData);
    return true;
}

// Show a snackbar looking feedback message. Standard message type is an error, unless told otherwise
function setUserFeedback(message, isError = true) {
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