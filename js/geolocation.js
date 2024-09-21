
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

$("#find-location").on("click", async () => {
    if (userGpsCoords[0].error == "none") {
        data = await adressAPI();

        L.marker([data.lower_distance_coords.latitude, data.lower_distance_coords.longitude]).addTo(map)
            .bindPopup(data.lower_distance_coords.name)
            .openPopup();
         
        $("#go-location").show();
    }
    else {
        alert(userGpsCoords[0].error);
    }
});

$("#go-location").on("click", () => {
    if (userGpsCoords[0].error == "none" && data) {
        window.location = `https://www.google.com/maps/dir/?api=1&destination=${data.lower_distance_coords.latitude},${data.lower_distance_coords.longitude}`;
    }
});

var map = L.map('map').setView([-15.59521325251528, -56.08745663700781], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);