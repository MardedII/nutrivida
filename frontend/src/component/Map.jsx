import React, { useEffect } from 'react';
import L from 'leaflet';

export default function Map() {
    useEffect(() => {
        const mapContainer = L.DomUtil.get('map');
        if (mapContainer != null) {
            mapContainer._leaflet_id = null;
        }

        const lat = -38.7397;
        const lng = -72.5901;
        const map = L.map('map').setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Clínica NutriVida'
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
            .bindPopup('Clínica NutriVida<br>Av. Alemania #0855, Temuco.')
            .openPopup();

        return () => map.remove();
    }, []);

    return <div id="map"></div>;
}