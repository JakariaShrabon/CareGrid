"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BloodDonor } from "@/contracts/blood";
import { formatRelative } from "@/lib/utils/date";

// Fix Leaflet's default icon paths in Next.js
const hospitalIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="flex items-center justify-center w-8 h-8 bg-sky-600 text-white rounded-full border-2 border-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const donorIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full border-2 border-white shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface DonorMapProps {
  donors: BloodDonor[];
}

export default function DonorMap({ donors }: DonorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  // Filter only eligible donors with coordinates
  const mappableDonors = donors.filter(d => d.eligible && d.latitude !== undefined && d.longitude !== undefined);

  useEffect(() => {
    if (!mapRef.current) return;

    // Default center (mock hospital)
    const hospitalCoords: [number, number] = [40.7128, -74.0060];

    // Initialize map only once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView(hospitalCoords, 11);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMap.current);

      // Add Hospital Marker
      L.marker(hospitalCoords, { icon: hospitalIcon })
        .bindPopup("<b>Central Hospital</b><br/>Blood Bank Hub")
        .addTo(leafletMap.current);
    }

    const map = leafletMap.current;

    // Clear existing donor markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.icon === donorIcon) {
        map.removeLayer(layer);
      }
    });

    // Add donor markers
    mappableDonors.forEach(donor => {
      if (donor.latitude !== undefined && donor.longitude !== undefined) {
        const popupContent = `
          <div class="text-sm">
            <strong class="text-slate-900">${donor.displayName}</strong><br/>
            <span class="text-rose-600 font-semibold">${donor.bloodGroup}</span><br/>
            <span class="text-slate-600">${donor.distanceKm ? `${donor.distanceKm} km away` : ''}</span><br/>
            <span class="text-xs text-slate-500">Last: ${donor.lastDonationAt ? formatRelative(donor.lastDonationAt) : 'N/A'}</span>
          </div>
        `;
        L.marker([donor.latitude, donor.longitude], { icon: donorIcon })
          .bindPopup(popupContent)
          .addTo(map);
      }
    });

  }, [mappableDonors]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[500px] rounded-xl border border-border shadow-sm z-0 relative"
    />
  );
}
