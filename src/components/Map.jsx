import React, { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import countries from "world-atlas/countries-110m.json";
import useDinosaurs from "../hooks/useDinosaurs";
import DinosaursCard from "./DinosaursCard";

const ERAS = [
  {
    key: "Triassic",
    range: "252–201 Mya",
    accent: "orange",
    classes: {
      textActive: "text-orange-300",
      text: "text-orange-400/70",
      bgActive: "bg-orange-600",
      bg: "bg-orange-900/40",
      ring: "ring-orange-500",
      border: "border-orange-500",
      glow: "shadow-[0_0_24px_-4px_rgba(249,115,22,0.6)]",
      fill: "fill-orange-500",
      fillLight: "fill-orange-300",
    },
  },
  {
    key: "Jurassic",
    range: "201–145 Mya",
    accent: "emerald",
    classes: {
      textActive: "text-emerald-300",
      text: "text-emerald-400/70",
      bgActive: "bg-emerald-600",
      bg: "bg-emerald-900/40",
      ring: "ring-emerald-500",
      border: "border-emerald-500",
      glow: "shadow-[0_0_24px_-4px_rgba(16,185,129,0.6)]",
      fill: "fill-emerald-500",
      fillLight: "fill-emerald-300",
    },
  },
  {
    key: "Cretaceous",
    range: "145–66 Mya",
    accent: "rose",
    classes: {
      textActive: "text-rose-300",
      text: "text-rose-400/70",
      bgActive: "bg-rose-600",
      bg: "bg-rose-900/40",
      ring: "ring-rose-500",
      border: "border-rose-500",
      glow: "shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)]",
      fill: "fill-rose-500",
      fillLight: "fill-rose-300",
    },
  },
];

const CountryLayer = React.memo(function CountryLayer() {
  return (
    <Geographies geography={countries}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            className="fill-stone-800 stroke-stone-950 outline-none transition-colors hover:fill-stone-700"
            strokeWidth={0.5}
          />
        ))
      }
    </Geographies>
  );
});

function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEra, setSelectedEra] = useState("Jurassic");
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const dinosaurs = useDinosaurs();

  const era = ERAS.find((e) => e.key === selectedEra);

  const availableCountries = useMemo(
    () =>
      [
        ...new Set(
          dinosaurs
            .map((d) => d.location?.country)
            .filter(Boolean)
        ),
      ].sort(),
    [dinosaurs]
  );

  const filteredDinosaurs = useMemo(() => {
    return dinosaurs.filter((dinosaur) => {
      const matchesEra = dinosaur.period === selectedEra;

      const matchesSearch = dinosaur.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === "" ||
        dinosaur.location?.country === selectedCountry;

      return (
        matchesEra &&
        matchesSearch &&
        matchesCountry
      );
    });
  }, [
    dinosaurs,
    selectedEra,
    searchTerm,
    selectedCountry,
  ]);

  const resetSelection = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-200 font-sans">      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #a8a29e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Era-tinted ambient glow */}
      <div
        className={`pointer-events-none fixed inset-0 transition-colors duration-700 ${era.classes.bg} opacity-30 blur-3xl`}
      />

      <div className="relative flex flex-col md:flex-row min-h-screen">
        {/* STRATA COLUMN */}
        <aside className="flex md:flex-col border-b md:border-b-0 md:border-r border-stone-800 bg-stone-900/60 backdrop-blur-sm">
          <div className="hidden md:block px-4 pt-5 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Stratigraphic
            </p>

            <p className="font-serif text-sm text-stone-300">
              Column
            </p>
          </div>

          {ERAS.map((e) => {
            const isActive = e.key === selectedEra;

            return (
              <button
                key={e.key}
                onClick={() => {
                  setSelectedEra(e.key);
                  resetSelection();
                }}
                className={`group relative flex-1 md:flex-none flex md:flex-col items-center md:items-start justify-center gap-1 px-5 py-4 md:py-6 md:px-5 text-left transition-all duration-300 border-l-4 md:border-l-0 md:border-t-4 ${
                  isActive
                    ? `${e.classes.border} ${e.classes.bg} ${e.classes.glow}`
                    : "border-transparent hover:bg-stone-800/50"
                }`}
              >
                <span
                  className={`font-serif text-base md:text-lg tracking-wide transition-colors ${
                    isActive
                      ? e.classes.textActive
                      : "text-stone-400 group-hover:text-stone-200"
                  }`}
                >
                  {e.key}
                </span>

                <span
                  className={`font-mono text-[10px] tracking-wider transition-colors ${
                    isActive
                      ? e.classes.text
                      : "text-stone-600"
                  }`}
                >
                  {e.range}
                </span>
              </button>
            );
          })}
        </aside>

        {/* MAIN COLUMN */}
      <div className="relative flex-1 min-h-screen bg-stone-950">          {/* FLOATING TOOLBAR */}
          <div className="relative z-20 flex flex-wrap items-center gap-3 p-4 md:p-5 border-b border-stone-800 bg-stone-950/70 backdrop-blur-md">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search specimen..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetSelection();
                }}
                className={`w-full rounded-md border border-stone-700 bg-stone-900/80 py-2 pl-9 pr-3 text-sm text-stone-200 placeholder:text-stone-500 outline-none transition-colors focus:ring-1 ${era.classes.ring}`}
              />
            </div>

            {/* Country */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  resetSelection();
                }}
                className={`appearance-none rounded-md border border-stone-700 bg-stone-900/80 py-2 pl-3 pr-8 text-sm text-stone-200 outline-none transition-colors focus:ring-1 ${era.classes.ring}`}
              >
                <option value="">All countries</option>

                {availableCountries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {country}
                  </option>
                ))}
              </select>

              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Clear */}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("");
                setSelectedEra("Jurassic");
                resetSelection();
              }}
              className="rounded-md border border-stone-700 px-3 py-2 text-sm text-stone-400 transition-all hover:border-stone-500 hover:bg-stone-800 hover:text-stone-200"
            >
              Clear
            </button>

            {/* Result counter */}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/70 px-3 py-1.5">
              <span
                className={`h-2 w-2 rounded-full ${era.classes.bgActive}`}
              />

              <span className="font-mono text-xs text-stone-400">
                <span
                  className={`${era.classes.textActive} font-semibold`}
                >
                  {filteredDinosaurs.length}
                </span>{" "}
                fossil occurrences
              </span>
            </div>
          </div>

          {/* MAP */}
        <div className="relative min-h-[calc(100vh-96px)] bg-stone-950">            {selectedLocation && (
              <DinosaursCard
                dinosaur={selectedLocation}
                onClose={resetSelection}
              />
            )}

            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 150 }}
              className="block w-full h-[calc(100vh-96px)] bg-stone-950"            >
              <ZoomableGroup
                minZoom={1}
                maxZoom={8}
                onMoveEnd={({ zoom }) =>
                  setZoom(zoom)
                }
              >
                <CountryLayer />

                {filteredDinosaurs.map((dinosaur) => {
                  const isSelected =
                    selectedLocation?.occurrenceId ===
                    dinosaur.occurrenceId;

                  const isHovered =
                    hoveredId === dinosaur.occurrenceId;

                  const r = Math.max(
                    1,
                    3 / zoom
                  );

                  return (
                    <Marker
                      key={dinosaur.occurrenceId}
                      coordinates={
                        dinosaur.location.coordinates
                          .coordinates
                      }
                    >
                      {/* Selected marker glow */}
                      {isSelected && (
                        <circle
                          r={r * 2.4}
                          className={`${era.classes.fill} opacity-40 animate-ping`}
                        />
                      )}

                      {/* Main marker */}
                      <circle
                        r={
                          isHovered
                            ? r * 1.7
                            : r
                        }
                        className={`
                          ${
                            isSelected
                              ? era.classes.fillLight
                              : era.classes.fill
                          }
                          stroke-white/80
                          cursor-pointer
                          transition-all
                          duration-150
                        `}
                        strokeWidth={0.8}
                        onMouseEnter={() =>
                          setHoveredId(
                            dinosaur.occurrenceId
                          )
                        }
                        onMouseLeave={() =>
                          setHoveredId(null)
                        }
                        onClick={() =>
                          setSelectedLocation(
                            dinosaur
                          )
                        }
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;