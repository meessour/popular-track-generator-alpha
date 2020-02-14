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

let token

artistsNameInput.addEventListener("input", function () {
    const INPUT = artistsNameInput.value

    // Check if input is not empty
    if (INPUT && INPUT !== "" && INPUT.length) {
        searchArtistInput(INPUT);
    } else {
        clearSearch()
        console.log("Input is empty");
    }
});

routie(':id', function(id) {
    setMostPopularTracks(id) 
    clearSearch()
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
    if (!artistId) { console.log("artistId is undefined"); return }

    // Get the token
    if (!token) {
        await init()
        if (!token) {
            console.log("Token could not be set");
            return
        }
    }

    // Fetch the token
    let tracks = await Api.fetchTracks(artistId, token)
    if (!tracks) { console.log("tracks are undefined"); return }

    // Fill in and get the template with the search results
    const mostPopularTracksHtml = TemplateEngine.getMostPopularTracksTemplate(tracks);

    if (!mostPopularTracksHtml) { console.log("mostPopularTracksHtml is undefined"); return }

    // Fill the options in the list with results
    mostPopularTracks.innerHTML = mostPopularTracksHtml;
}

async function getTokenData() {
    // Fetch the token
    const tokenData = await Api.fetchToken()
    if (!tokenData) { console.log("tokenData is undefined"); return }

    // Parse the token
    const parsedToken = Parser.parseTokenData(tokenData)
    if (!parsedToken || !parsedToken.accessToken || !parsedToken.expiresIn) { console.log("Parsed token is undefined/invalid"); return }

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
            console.log("Token could not be set");
            return
        }
    }

    // Get the artists
    const artists = await Api.fetchArtists(input, token)
    if (!artists) { console.log("Artists is undefined"); return }

    // Fill in and get the template with the search results
    const searchResultsHtml = TemplateEngine.getArtistSearchResultsTemplate(artists);

    if (!searchResultsHtml) { console.log("searchResultsHtml is undefined"); return }

    // Fill the options in the list with results
    searchResult.innerHTML = searchResultsHtml;
}

function clearSearch() {
    searchResult.innerHTML = "";
    artistsNameInput.value = "";
}