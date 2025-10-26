import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { MapPinIcon } from '../components/icons/NavIcons';
import { LatLngTuple } from '../types';

// Declare Leaflet in the global scope to satisfy TypeScript
declare const L: any;

const WEIGHT_STORAGE_KEY = 'balance-ai-user-weight';
const INTENSITY_STORAGE_KEY = 'balance-ai-activity-intensity';

// Haversine formula to calculate distance between two points on Earth
const haversineDistance = (coords1: LatLngTuple, coords2: LatLngTuple): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in km
};


const ActivityTrackerPage: React.FC = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [path, setPath] = useState<LatLngTuple[]>([]);
    const [distance, setDistance] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [calories, setCalories] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [weight, setWeight] = useState<number>(70);
    const [intensity, setIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

    const watchIdRef = useRef<number | null>(null);
    const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
    
    const mapRef = useRef<any>(null);
    const polylineRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load settings from localStorage
        const savedWeight = localStorage.getItem(WEIGHT_STORAGE_KEY);
        if (savedWeight) setWeight(JSON.parse(savedWeight));
        const savedIntensity = localStorage.getItem(INTENSITY_STORAGE_KEY) as 'Low' | 'Moderate' | 'High' | null;
        if (savedIntensity) setIntensity(savedIntensity);

        // Cleanup on component unmount
        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isTracking) return;

        const MET_VALUES = { 'Low': 2.5, 'Moderate': 4.0, 'High': 7.0 };
        const met = MET_VALUES[intensity];
        const durationInHours = elapsedTime / 3600;
        const caloriesBurned = met * weight * durationInHours;
        setCalories(caloriesBurned);

    }, [elapsedTime, isTracking, weight, intensity]);

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = Number(e.target.value);
        setWeight(newWeight);
        localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(newWeight));
    };

    const handleIntensityChange = (newIntensity: 'Low' | 'Moderate' | 'High') => {
        setIntensity(newIntensity);
        localStorage.setItem(INTENSITY_STORAGE_KEY, newIntensity);
    };

    const initializeMap = (center: LatLngTuple) => {
        if (mapContainerRef.current && !mapRef.current) {
             mapRef.current = L.map(mapContainerRef.current).setView(center, 16);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(mapRef.current);
            polylineRef.current = L.polyline([], { color: '#C71585', weight: 4 }).addTo(mapRef.current);
            markerRef.current = L.marker(center).addTo(mapRef.current);
        }
    };
    
    const startTracking = () => {
        setError(null);
        setDistance(0);
        setPath([]);
        setCalories(0);
        setElapsedTime(0);
        setIsTracking(true);

        timerIdRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPoint: LatLngTuple = [latitude, longitude];

                setPath(prevPath => {
                    const updatedPath = [...prevPath, newPoint];
                    if (updatedPath.length > 1) {
                        const lastPoint = updatedPath[updatedPath.length - 2];
                        setDistance(prevDist => prevDist + haversineDistance(lastPoint, newPoint));
                    }
                    if (!mapRef.current) initializeMap(newPoint);
                    else {
                        mapRef.current.setView(newPoint, 16);
                        markerRef.current.setLatLng(newPoint);
                        polylineRef.current.setLatLngs(updatedPath);
                    }
                    return updatedPath;
                });
            },
            (err) => {
                setError("Could not get location. Please enable location services.");
                stopTracking();
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const stopTracking = () => {
        setIsTracking(false);
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
    
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="animate-fadeIn space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold neon-text-orchid">Live Activity Tracking</h1>
                <p className="text-lg text-soft-gray mt-2">Track your walk and see your progress in real-time.</p>
            </header>
            
             <GlassCard>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-soft-gray">Distance</p>
                        <p className="text-2xl lg:text-3xl font-bold">{distance.toFixed(2)} km</p>
                    </div>
                    <div>
                        <p className="text-sm text-soft-gray">Time</p>
                        <p className="text-2xl lg:text-3xl font-bold">{formatTime(elapsedTime)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-soft-gray">Calories</p>
                        <p className="text-2xl lg:text-3xl font-bold">{Math.round(calories)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-soft-gray">Pace</p>
                        <p className="text-2xl lg:text-3xl font-bold">{distance > 0 ? (elapsedTime / 60 / distance).toFixed(2) : '0.00'} min/km</p>
                    </div>
                </div>
            </GlassCard>

             <GlassCard>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium text-soft-gray" htmlFor="weight">Your Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={handleWeightChange}
                            disabled={isTracking}
                            className="mt-1 w-full bg-secondary-bg border border-orchid-purple/30 rounded-lg py-2 px-3 text-sm placeholder-soft-gray/50 focus:outline-none focus:ring-1 focus:ring-neon-pink disabled:opacity-50"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium text-soft-gray">Intensity</label>
                        <div className="mt-2 flex gap-2">
                            {(['Low', 'Moderate', 'High'] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => handleIntensityChange(level)}
                                    disabled={isTracking}
                                    className={`px-4 py-2 w-full rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${intensity === level ? 'bg-neon-pink text-white' : 'bg-secondary-bg hover:bg-card-bg'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard>
                <div 
                    ref={mapContainerRef} 
                    className={`aspect-video w-full rounded-lg transition-all duration-500 ${isTracking ? 'h-96' : 'h-0 opacity-0'}`} 
                    style={{ backgroundColor: '#1a1a2e' }}
                />
                 {!isTracking && (
                    <div className="aspect-video w-full bg-deep-black/30 border-2 border-dashed border-orchid-purple/50 rounded-lg flex flex-col items-center justify-center">
                        <MapPinIcon className="w-16 h-16 text-soft-gray/50 mb-4" />
                        <h2 className="text-xl font-bold text-soft-gray">Ready to track your walk?</h2>
                        <p className="text-soft-gray/80">Press 'Start Tracking' to begin.</p>
                    </div>
                )}
            </GlassCard>

             <div className="max-w-md mx-auto">
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                {!isTracking ? (
                    <NeonButton onClick={startTracking}>
                        Start Tracking
                    </NeonButton>
                ) : (
                    <NeonButton onClick={stopTracking} className="bg-red-500/80 border-red-500/90 shadow-red-500/30 hover:bg-red-500">
                        Stop Tracking
                    </NeonButton>
                )}
            </div>
        </div>
    );
};

export default ActivityTrackerPage;