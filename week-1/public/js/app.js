// function fetchData(url, timeout, callback) {
function fetchData() {
    const input = document.getElementById('input').value
    const baseUrl = 'https://api.spotify.com/v1/'
    const searchType = 'artist'
    const finalUrl = `${baseUrl}search?q=${input}&type=${searchType}`

    const requestType = 'GET'
    const authorizationKey = 'BQBm1yBoEO9dpqKRw7WAnG_qVAcJkwnHJiSI3oFuIITt43c1VoFFVB6ZsYA1oqa9TOZcGnny2uzb0RdbufO-QCrhdvfRoefQ43AICPnI28POpyblnknbjOwn4Jxkhn0FtwI-P3TLBRvYvhdllvbWI8uebym5bMZrJSsos-VA'

    var xhr = new XMLHttpRequest();
    xhr.open(requestType, finalUrl, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${authorizationKey}`);
    xhr.onload = function(e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = xhr.responseText
                setContent(response)
            } else {
                var response = xhr.statusText
                setContent(response)
            }
        }
    };
    xhr.onerror = function(e) {
        var response = xhr.statusText
        setContent(response)
    };
    xhr.send();
}

function setContent(data) {
    var parsedData = JSON.parse(data)
    var artists = parsedData.artists
    var items = artists.items

    console.log('Data', items)

    var html = '';

    items.map(artist => html += '<option value="' + artist.name + '">');

    console.log('html', html)
    document.getElementById('wordlist').innerHTML = html;


    // $("#wordlist").append(html);
}

// function processRequest(e) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//         var response = JSON.parse(xhr.responseText);
//         var result = '';
//         for (var i = 0; i < response.artists.items.length; i++) {
//             console.log(response.artists.items[i]);
//             result += '<div class="panel panel-primary"><div class="panel-body">' +
//                 'name : ' + response.artists.items[i].name + '<br/>' +
//                 'popularity : ' + response.artists.items[i].popularity + '<br/>' +
//                 'type : ' + response.artists.items[i].type + '</div></div>';
//         }
//         document.getElementById("artists").innerHTML = result;
//     }
// }

// const render = async() => {
//     const data = await fetchData();
//     console.log(data);
// };

// render()