maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: foodzone.geometry.coordinates,
    zoom: 14
});

new maptilersdk.Marker()
    .setLngLat(foodzone.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${foodzone.name}</h3><p>${foodzone.location}</p>`
            )
    )
    .addTo(map)
