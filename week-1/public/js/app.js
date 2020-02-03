// function fetchData(url, timeout, callback) {
function fetchData() {
    var xhr = new XMLHttpRequest();
    var url = "https://api.spotify.com/v1/search?q=Camo&type=artist"

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', "Bearer BQC-0lB6in850eU4qYq0TPYun_pNH7bgmg39hjDPmMr8aEwDtSFtB5zN2aMd6gq54woAr8VTjmSzqurBswhRrN6YQHrljkmqs_U39-MNYRXNESNwYIdZd2tyNOeMLRZGHA21sMPx8TP-aKt9BQHda_UVN03RWnFfcGfXscKq")
    xhr.onload = function(e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = xhr.responseText
                setContent(JSON.parse(response))
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
    console.log('Data', data)

    document.getElementById("result").innerHTML = data;
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