export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGl2eWFuc2h1cGFuZGV5MTcwMiIsImEiOiJja3d6OHo0czgwZmo0MnZueTQ1dWlqbGdrIn0.LSqlNwbWv9NdY9Dh47Q90g';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/divyanshupandey1702/ckwzay4ma0uqw14o7duwoljsn', // style URL
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bound to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100,
    },
  });
};
