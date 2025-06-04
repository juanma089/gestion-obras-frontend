import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
    Circle,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MessageModal, MessageType } from "./MessageModal";
import 'leaflet/dist/leaflet.css';
import { X } from "lucide-react";

interface Props {
    onSelect: (lat: number, lng: number, locationRange: number) => void;
    initialCoords?: [number, number];
    locationRange?: number;
}

const defaultCenter: [number, number] = [4.8143, -75.6946]; // Colombia

const cities = [
    { name: "Bogotá", coords: [4.6097, -74.0817] }, // Capital
    { name: "Medellín", coords: [6.2442, -75.5812] }, // Antioquia
    { name: "Cali", coords: [3.4516, -76.5319] }, // Valle del Cauca
    { name: "Barranquilla", coords: [10.9685, -74.7813] }, // Atlántico
    { name: "Cartagena", coords: [10.3910, -75.4794] }, // Bolívar
    { name: "Bucaramanga", coords: [7.1193, -73.1227] }, // Santander
    { name: "Pereira", coords: [4.8143, -75.6946] }, // Risaralda
    { name: "Santa Marta", coords: [11.2408, -74.1990] }, // Magdalena
    { name: "Ibagué", coords: [4.4375, -75.2000] }, // Tolima
    { name: "Manizales", coords: [5.0689, -75.5174] }, // Caldas
    { name: "Neiva", coords: [2.9345, -75.2809] }, // Huila
    { name: "Cúcuta", coords: [7.8939, -72.5078] }, // Norte de Santander
    { name: "Villavicencio", coords: [4.1420, -73.6266] }, // Meta
    { name: "Armenia", coords: [4.5380, -75.6721] }, // Quindío
    { name: "Valledupar", coords: [10.4631, -73.2532] }, // Cesar
    { name: "Montería", coords: [8.7500, -75.8833] }, // Córdoba
    { name: "Sincelejo", coords: [9.3047, -75.3978] }, // Sucre
    { name: "Popayán", coords: [2.4448, -76.6147] }, // Cauca
    { name: "Tunja", coords: [5.5353, -73.3678] }, // Boyacá
    { name: "Riohacha", coords: [11.5442, -72.9069] }  // La Guajira
];

function LocationMarker({
    setSelectedCoords,
}: {
    setSelectedCoords: (coords: [number, number]) => void;
}) {
    useMapEvents({
        click(e) {
            setSelectedCoords([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13);
    }, [center]);
    return null;
}

export default function MapModal({ onSelect, initialCoords, locationRange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
    const [center, setCenter] = useState<[number, number]>(defaultCenter);
    const [radius, setRadius] = useState<number>(100);

    const openModal = () => {
        if (initialCoords && locationRange) {
            setSelectedCoords(initialCoords);
            setRadius(locationRange);
            setCenter(initialCoords);
        }
        setIsOpen(true)
    };
    const closeModal = () => setIsOpen(false);

    const [notification, setNotification] = useState<{ message: string, type: MessageType } | null>(null);
    const locateUser = () => {
        if (!navigator.geolocation) {
            setNotification({ message: "Geolocalización no soportada", type: "error" })
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const coords: [number, number] = [latitude, longitude];
                setCenter(coords);
                setSelectedCoords(coords);
            },
            (err) => {
                setNotification({ message: "No se pudo obtener la ubicación actual.", type: "error" })
                console.error("Error al obtener ubicación:", err);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };


    return (
        <>
            {/* Botón para abrir modal */}
            <button type="button"
                onClick={openModal}
                className="bg-blue-600 text-white sm:px-4 px-2 sm:py-2 py-1 rounded hover:bg-blue-700 text-sm sm:text-base"
            >
                Seleccionar Ubicación
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-gradient-to-tr from-gray-900 to-gray-300 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
                        {/* Encabezado */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">Selecciona una ubicación</h2>
                            <button
                                className="text-red-500 font-semibold"
                                onClick={closeModal}
                            >
                                <X className="text-black"/>
                            </button>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-4 mb-2 items-center">
                            <button type="button"
                                onClick={locateUser}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            >
                                Ubicación actual
                            </button>
                            <select
                                onChange={(e) => {
                                    const city = cities.find((c) => c.name === e.target.value);
                                    if (city) setCenter(city.coords as [number, number]);
                                }}
                                className="border px-2 py-1 rounded text-sm"
                            >
                                <option>-- Selecciona ciudad --</option>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mapa */}
                        <div className="flex-1 border rounded overflow-hidden">
                            <MapContainer center={center} zoom={13} className="w-full h-full">
                                <TileLayer
                                    attribution="© OpenStreetMap"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker setSelectedCoords={setSelectedCoords} />
                                <MapController center={center} />
                                {selectedCoords && (
                                    <>
                                        <Marker
                                            position={selectedCoords}
                                            icon={L.icon({
                                                iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                                                iconSize: [25, 41],
                                                iconAnchor: [12, 41],
                                            })}
                                        />
                                        <Circle
                                            center={selectedCoords}
                                            radius={radius}
                                            pathOptions={{ fillColor: 'blue' }}
                                        />
                                    </>

                                )}
                            </MapContainer>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Radio:</span>
                                <input
                                    type="range"
                                    min="50"
                                    max="900"
                                    step="10"
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-32"
                                    disabled={!selectedCoords}
                                />
                                <span className="text-sm w-12">{radius}m</span>
                            </div>

                            <button
                                disabled={!selectedCoords}
                                onClick={() => {
                                    if (selectedCoords) {
                                        onSelect(selectedCoords[0], selectedCoords[1], radius);
                                        closeModal();
                                    }
                                }}
                                className={`px-4 py-2 rounded ${selectedCoords
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <MessageModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

        </>
    );
}