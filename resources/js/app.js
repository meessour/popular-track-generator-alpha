import * as TemplateEngine from './modules/template-engine.js';
import * as Api from './modules/api.js';
import * as Getters from './modules/getters.js';
import * as Setters from './modules/setters.js';
import * as UserFeedback from './modules/user-feedback.js';

// Routie, a routing library
import './libraries/routie.min.js';

const artistsNameInput = document.getElementById("artist-name-input");
const searchResult = document.getElementById("search-result");
const mostPopularTracks = document.getElementById("most-popular-tracks");
// const showFeedback = document.getElementById("show-feedback");
// const hideFeedback = document.getElementById("hide-feedback");

// showFeedback.addEventListener("click", function () {
//     UserFeedback.startLoadingFeedback();
// });
// hideFeedback.addEventListener("click", function () {
//     UserFeedback.stopLoadingFeedback();
// });

artistsNameInput.addEventListener("input", function () {
    const input = artistsNameInput.value;

    // Check if input is not empty
    if (isString(input)) {
        searchArtistInput(input);
    } else {
        clearSearchBar();
        clearTrackResults();
        clearSearchResults();
    }
});

// check if value is a valid string with content
function isString(value) {
    return value && value !== "" && value.length > 0 && value.trim().length > 0;
}

routie(':id', function (id) {
    clearSearchBar();
    clearTrackResults();
    clearSearchResults();
    Setters.setMostPopularTracks(id);
});

async function searchArtistInput(input) {
    try {
        const token = await Getters.getToken();
        if (!token)
            throw "Token could not be set";

        // Fetch the artists from the API
        const artists = await Api.fetchArtists(input, token);
        if (!artists || !artists.length) {
            clearSearchResults();
            throw "No artist found with that name";
        }

        // Fill in and get the template with the search results
        const searchResultsHtml = TemplateEngine.getArtistSearchResultsTemplate(artists);

        if (!searchResultsHtml) {
            clearSearchResults();
            throw "Artist's could not be set";
        }

        // Fill the options in the list with results
        searchResult.classList.remove("hidden");
        searchResult.innerHTML = searchResultsHtml;
    } catch (error) {
        UserFeedback.setUserFeedback(error);
    }
}

function clearSearchBar() {
    artistsNameInput.value = "";
}

function clearSearchResults() {
    searchResult.classList.add("hidden");
    searchResult.innerHTML = "";
}

function clearTrackResults() {
    mostPopularTracks.innerHTML = "";
}