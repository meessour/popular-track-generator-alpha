import * as TemplateEngine from './modules/template-engine.js';
import * as Api from './modules/api.js';
import * as Parser from './modules/parser.js';
import * as LocalStorage from './modules/local-storage.js';

// Routie, a library used for handling routing
import './libs/routie.min.js';

init()

const artistsNameInput = document.getElementById("artist-name-input")
const searchResult = document.getElementById("search-result")
const mostPopularTracks = document.getElementById("most-popular-tracks")
const userFeedbackContainer = document.getElementById("user-feedback-container")
const userFeedbackText = document.getElementById("user-feedback-text")

let token

artistsNameInput.addEventListener("input", function() {
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
    return value && value !== "" && value.length
}

routie(':id', function(id) {
    setMostPopularTracks(id)
    clearSearchBar()
    clearSearchResults()
});

async function init() {
    // Get the token
    token = await LocalStorage.getTokenFromLocalStorage();

    if (!token) {
        const tokenData = await getTokenData();
        setToken(tokenData);
    }
}

async function setMostPopularTracks(artistId) {

    if (!artistId) { setUserFeedback(true, "Could not search tracks for artist"); return }

    // Get the token
    if (!token) {
        await init()
        if (!token) {
            setUserFeedback(true, "Could not fetch items from Spotify");
            return
        }
    }

    // Fetch the artist's information
    let artist = await Api.fetchArtistNameById(artistId, token)

    if (!artist) { setUserFeedback(true, "Artist's information could not be loaded"); return }

    // Fetch the tracks
    let tracks = await Api.fetchTracksByName(artist, token)
    if (!tracks) { setUserFeedback(true, "Artist's tracks could not be loaded"); return }

    console.log("all tracks", tracks);
    
    let parsedTracks = await Parser.filterTracks(tracks, artistId)
    if (!parsedTracks) { setUserFeedback(true, "Tracks did not parse successfully"); return }

    // Fill in and get the template with the search results
    const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(tracks);

    if (!mostPopularTracksHtml) { setUserFeedback(true, "Could not load results in list"); return }

    setUserFeedback(false, "Showing results for " + artist)

    // Fill the options in the list with results
    mostPopularTracks.innerHTML = mostPopularTracksHtml;
}

async function getTokenData() {
    // Fetch the token
    const tokenData = await Api.fetchToken()
    if (!tokenData) { setUserFeedback(true, "Could not fetch items from Spotify"); return }

    // Parse the token
    const parsedToken = Parser.parseTokenData(tokenData)
    if (!parsedToken || !parsedToken.accessToken || !parsedToken.expiresIn) { setUserFeedback(true, "Could not fetch items from Spotify"); return }

    return parsedToken
}

function setToken(tokenData) {
    if (tokenData && tokenData.accessToken && tokenData.expiresIn) {
        token = tokenData.accessToken

        LocalStorage.setTokenInLocalStorage(tokenData.accessToken, tokenData.expiresIn)
    }
}

async function searchArtistInput(input) {
    // Get the token
    if (!token) {
        await init()
        if (!token) {
            setUserFeedback(true, "Could not fetch items from Spotify");
            return
        }
    }

    // Get the artists
    const artists = await Api.fetchArtists(input, token)
    if (!artists) { setUserFeedback(true, "Artist's could not be loaded loaded"); return }

    // Fill in and get the template with the search results
    const searchResultsHtml = TemplateEngine.getArtistSearchResultsTemplate(artists);

    if (!searchResultsHtml) {
        setUserFeedback(true, "Could not load results"), clearSearchResults();
        return
    }

    // Fill the options in the list with results
    searchResult.innerHTML = searchResultsHtml;
}

function setUserFeedback(isError, message) {
    // Set container color either the error or success color
    isError ?
        userFeedbackContainer.classList.add("error-color") :
        userFeedbackContainer.classList.add("success-color");

    // Set the user feedback
    userFeedbackText.innerHTML = message;

    // Show user feedback
    userFeedbackContainer.classList.add("show-user-feedback");

    // Show the feedback notification for 1.75 seconds
    setTimeout(function() {
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