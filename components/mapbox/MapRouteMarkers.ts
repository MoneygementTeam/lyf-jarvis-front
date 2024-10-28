import mapboxgl from 'mapbox-gl';

export type RouteMarker = {
  name: string;
  latitude: number;
  longitude: number
  category: string;
};

const categoryColor = (category: string): string => {
    switch (category) {
      case 'restaurant':
        return '#FF6347'; // Tomato color for restaurants
      case 'activity':
        return '#1E90FF'; // Dodger Blue for activity
      case 'tourist':
        return '#FFD700'; // Gold for tourist
      default:
        return '#808080'; // Grey for other categories
    }
};

export const addMarkers = (map: mapboxgl.Map, markers: RouteMarker[]) => {
  // 마커 추가
  markers.forEach(({ latitude, longitude, category }) => {
    console.log("longitude = " + longitude + ", latitude = " + latitude + ", category = " + category );
    new mapboxgl.Marker({
      color: categoryColor(category),
      scale: 6,
      occludedOpacity: 0.5,
      draggable: true
    })
      .setLngLat([longitude, latitude])
      .addTo(map);
  });

  // 마커 텍스트 레이어
  const textFeatures = markers.map(({ name, longitude, latitude }) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [longitude, latitude]
    },
    properties: {
      label: name
    }
  }));

  map.addSource('marker-labels', {
    type: 'geojson',
    data: {
      type: "FeatureCollection",
      features: textFeatures
    }
  });

  map.addLayer({
    id: 'marker-labels-layer',
    type: 'symbol',
    source: 'marker-labels',
    layout: {
      'text-field': ['get', 'label'],
      'text-size': 30,
      'text-anchor': 'top',
      'text-offset': [0, 1.2],
    },
    paint: {
      'text-color': '#1E90FF',          // 진한 하늘색 텍스트
      'text-halo-color': '#000000',      // 밝은 하늘색 외곽선
      'text-halo-width': 1,              // 외곽선 두께
      'text-halo-blur': 1                // 외곽선 흐림 효과
    }
  });
};