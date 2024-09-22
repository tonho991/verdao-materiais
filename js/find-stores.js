
const userGpsCoords = [{ error: "none" }, {}];
const responseArray = [];
let data;

function getGpsPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userGpsCoords[1] = position.coords;
            userGpsCoords[0].error = "none";
        });
    } else {
        userGpsCoords[0].error = "GPS_PERMISSION_DENIED";
    }
}

async function adressAPI() {
    const response = await fetch(`https://api-verdao-materiais.vercel.app/geolocation/${userGpsCoords[1].latitude}/${userGpsCoords[1].longitude}/${userGpsCoords[1].accuracy}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET"
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        return responseJson;
    });
    return response;
}

getGpsPermission();

var map = L.map('map').setView([-15.607282, -56.119839], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var markers = [];

function addMarker(latitude, longitude, popupText) {

    if (markers.length === 0) {
        map.flyTo([latitude, longitude], 16, { duration: 0.5 });
    }

    var marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup(popupText)
        .openPopup();

    markers.push(marker);
}

function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}


$("#find-location").on("click", async () => {
    if (userGpsCoords[1].latitude && userGpsCoords[1].longitude) {
        try {
            $("#find-location").hide();
            $(".loading").show();
            $("#go-location").hide();

            data = await adressAPI();
            if (markers) clearMarkers();
            addMarker(data.lower_distance_coords.latitude, data.lower_distance_coords.longitude, data.lower_distance_coords.name)

            $("#find-location").show();
            $(".loading").hide();
            $("#go-location").show();
        } catch (e) {
            console.log(e);
            alert(`Falha ao obter a localização\nErro: ${e}`);
        }
    } else {
        alert(`Falha ao obter a localização\nErro: permissão de acesso a localização negada.`);
        getGpsPermission()
    }
});

$("#go-location").on("click", () => {
    if (userGpsCoords[0].error == "none" && data) {
        window.location = `https://www.google.com/maps/dir/?api=1&destination=${data.lower_distance_coords.latitude},${data.lower_distance_coords.longitude}`;
    }
});