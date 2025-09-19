import React, { useEffect, useRef } from 'react';

// Since Leaflet is loaded from a CDN, we need to tell TypeScript about the 'L' global variable.
declare var L: any;

// Mock data for shelters with coordinates
const shelters = [
  { id: 1, name: 'Govt. High School Relief Camp', location: [28.635, 77.225], available: 80, capacity: 250 },
  { id: 2, name: 'Community Hall, Sector 12', location: [28.580, 77.320], available: 25, capacity: 150 },
  { id: 3, name: 'Red Cross Shelter', location: [28.610, 77.210], available: 90, capacity: 100 },
];

// Mock data for hazard zones
const hazardZones = [
    { id: 1, name: 'Flood Prone Area', coords: [28.65, 77.25], radius: 1500, type: 'flood' },
    { id: 2, name: 'Landslide Risk Zone', coords: [[28.59, 77.18], [28.60, 77.20], [28.58, 77.21]], type: 'landslide' }
];

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Initialize map
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([28.6139, 77.2090], 11);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapRef.current = map;

            // Add dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

            // Add shelters
            const shelterIcon = L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #28A745" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
                className: 'bg-transparent border-0',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            shelters.forEach(shelter => {
                L.marker(shelter.location, { icon: shelterIcon })
                    .addTo(map)
                    .bindPopup(`<b>${shelter.name}</b><br>Available: ${shelter.available}/${shelter.capacity}`);
            });
            
            // Add hazard zones
            hazardZones.forEach(zone => {
                if (zone.type === 'flood') {
                     L.circle(zone.coords, {
                        color: '#FD7E14', // brand-orange
                        fillColor: '#FD7E14',
                        fillOpacity: 0.3,
                        radius: zone.radius
                    }).addTo(map).bindPopup(`<b>${zone.name}</b><br>High flood risk.`);
                } else if (zone.type === 'landslide') {
                     L.polygon(zone.coords, {
                        color: '#DC3545', // brand-red
                        fillColor: '#DC3545',
                        fillOpacity: 0.3
                    }).addTo(map).bindPopup(`<b>${zone.name}</b><br>High landslide risk.`);
                }
            });

            // Add user location
            map.locate({setView: true, maxZoom: 14});
            
            const userIcon = L.divIcon({
              html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" style="color: #007BFF" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>`,
              className: 'bg-transparent border-0',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });

            function onLocationFound(e: any) {
                L.marker(e.latlng, { icon: userIcon }).addTo(map)
                    .bindPopup("You are here").openPopup();
                L.circle(e.latlng, {
                  radius: e.accuracy,
                  color: '#007BFF',
                  fillColor: '#007BFF',
                  fillOpacity: 0.1,
                  weight: 1
                }).addTo(map);
            }
            map.on('locationfound', onLocationFound);
        }

        return () => { // Cleanup function
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
      <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
        <h2 className="text-3xl font-bold text-brand-gray-100 mb-4">Real-time Hazard & Resource Map</h2>
        <p className="text-brand-gray-400 mb-6">
          This map shows nearby shelters, known hazard zones, and your current location. Stay informed and find the safest routes.
        </p>
        
        <div ref={mapContainerRef} style={{ height: '500px', borderRadius: '8px', zIndex: 0, backgroundColor: '#1a1a1a' }} className="w-full" aria-label="Interactive map" />
        
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-gray-300">
            <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-green" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
                <span>Shelter</span>
            </div>
             <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0 flex items-center justify-center">
                    <span className="h-4 w-4 rounded-full bg-brand-orange/50 border border-brand-orange"></span>
                </div>
                <span>Flood Zone</span>
            </div>
             <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0 flex items-center justify-center">
                  <span className="h-4 w-4 rounded-full bg-brand-red/50 border border-brand-red"></span>
                </div>
                <span>Landslide Zone</span>
            </div>
            <div className="flex items-center gap-2">
                <div style={{width: '24px', height: '24px'}} className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <span>Your Location</span>
            </div>
        </div>
      </div>
    );
};

export default Map;
