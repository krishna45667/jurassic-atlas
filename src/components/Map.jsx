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

/* ─────────────────────────────────────
   JURASSIC ATLAS — ERA PALETTE
   Ancient field-journal aesthetic
───────────────────────────────────── */

const ERAS = [
  {
    key: "Triassic",
    range: "252–201 Mya",
    classes: {
      textActive: "text-[#7f3f2f]",
      text: "text-[#7f3f2f]/70",
      bgActive: "bg-[#8b3e32]",
      bg: "bg-[#8b3e32]/10",
      ring: "ring-[#8b3e32]",
      border: "border-[#8b3e32]",
      fill: "fill-[#8b3e32]",
      fillLight: "fill-[#b5654d]",
    },
  },
  {
    key: "Jurassic",
    range: "201–145 Mya",
    classes: {
      textActive: "text-[#344634]",
      text: "text-[#536b4f]/80",
      bgActive: "bg-[#536b4f]",
      bg: "bg-[#536b4f]/10",
      ring: "ring-[#536b4f]",
      border: "border-[#536b4f]",
      fill: "fill-[#536b4f]",
      fillLight: "fill-[#758b70]",
    },
  },
  {
    key: "Cretaceous",
    range: "145–66 Mya",
    classes: {
      textActive: "text-[#684333]",
      text: "text-[#8b6048]/80",
      bgActive: "bg-[#8b6048]",
      bg: "bg-[#8b6048]/10",
      ring: "ring-[#8b6048]",
      border: "border-[#8b6048]",
      fill: "fill-[#8b6048]",
      fillLight: "fill-[#aa8062]",
    },
  },
];

/* ─────────────────────────────────────
   WORLD MAP
───────────────────────────────────── */

const CountryLayer = React.memo(function CountryLayer() {
  return (
    <Geographies geography={countries}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            className="
              fill-[#cbb995]
              stroke-[#806b4d]
              outline-none
              transition-colors
              hover:fill-[#bca982]
            "
            strokeWidth={0.45}
          />
        ))
      }
    </Geographies>
  );
});

/* ─────────────────────────────────────
   MAP
───────────────────────────────────── */

function Map() {
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [selectedEra, setSelectedEra] =
    useState("Jurassic");

  const [zoom, setZoom] = useState(1);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCountry, setSelectedCountry] =
    useState("");

  const [hoveredId, setHoveredId] =
    useState(null);

  const dinosaurs = useDinosaurs();

  const era = ERAS.find(
    (e) => e.key === selectedEra
  );

  /* ─────────────────────────────────────
     AVAILABLE COUNTRIES
  ───────────────────────────────────── */

  const availableCountries = useMemo(
    () =>
      [
        ...new Set(
          dinosaurs
            .map(
              (d) =>
                d.location?.country
            )
            .filter(Boolean)
        ),
      ].sort(),
    [dinosaurs]
  );

  /* ─────────────────────────────────────
     FILTER DINOSAURS
  ───────────────────────────────────── */

  const filteredDinosaurs = useMemo(() => {
    return dinosaurs.filter((dinosaur) => {
      const matchesEra =
        dinosaur.period === selectedEra;

      const matchesSearch =
        dinosaur.name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesCountry =
        selectedCountry === "" ||
        dinosaur.location?.country ===
          selectedCountry;

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

  /* ─────────────────────────────────────
     RESET SELECTION
  ───────────────────────────────────── */

  const resetSelection = () => {
    setSelectedLocation(null);
  };

  return (
    <div
      className="
        relative
        min-h-screen
        bg-[#e8d8b8]
        text-[#2b2118]
        font-sans
      "
    >
      {/* ─────────────────────────────────
          SUBTLE PAPER TEXTURE
      ───────────────────────────────── */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          opacity-[0.22]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(74,55,32,0.18) 0.7px, transparent 0.7px)",
          backgroundSize: "9px 9px",
        }}
      />

      {/* ─────────────────────────────────
          ERA AMBIENT TINT
      ───────────────────────────────── */}

      <div
        className={`
          pointer-events-none
          fixed
          inset-0
          z-0
          transition-colors
          duration-700
          ${era.classes.bg}
        `}
      />

      {/* ─────────────────────────────────
          MAIN LAYOUT
      ───────────────────────────────── */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          flex-col
          md:flex-row
        "
      >
        {/* ═══════════════════════════════
            STRATIGRAPHIC COLUMN
        ═══════════════════════════════ */}

        <aside
          className="
            flex
            border-b
            border-[#9b835e]
            bg-[#d2bd91]/95
            md:flex-col
            md:border-b-0
            md:border-r
          "
        >
          {/* Header */}

          <div className="hidden px-5 pb-4 pt-6 md:block">
            <p
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-[#85745d]
              "
            >
              Stratigraphic
            </p>

            <p
              className="
                mt-1
                font-serif
                text-base
                text-[#2b2118]
              "
            >
              Column
            </p>

            <div className="mt-4 h-px bg-[#9b835e]/60" />
          </div>

          {/* Eras */}

          {ERAS.map((e) => {
            const isActive =
              e.key === selectedEra;

            return (
              <button
                key={e.key}
                onClick={() => {
                  setSelectedEra(e.key);
                  resetSelection();
                }}
                className={`
                  group
                  relative
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-1
                  border-l-4
                  px-5
                  py-4
                  text-left
                  transition-all
                  duration-300
                  md:flex-none
                  md:flex-col
                  md:items-start
                  md:border-l-0
                  md:border-t-4
                  md:px-5
                  md:py-7

                  ${
                    isActive
                      ? `${e.classes.border} ${e.classes.bg}`
                      : "border-transparent hover:bg-[#e8d8b8]/60"
                  }
                `}
              >
                {/* Small archive mark */}

                <span
                  className={`
                    absolute
                    left-2
                    top-1/2
                    hidden
                    -translate-y-1/2
                    text-xs
                    opacity-50
                    md:block
                    ${
                      isActive
                        ? e.classes.textActive
                        : "text-[#85745d]"
                    }
                  `}
                >
                  ◆
                </span>

                <span
                  className={`
                    font-serif
                    text-base
                    tracking-wide
                    transition-colors
                    md:text-lg
                    ${
                      isActive
                        ? e.classes.textActive
                        : "text-[#5a4935] group-hover:text-[#2b2118]"
                    }
                  `}
                >
                  {e.key}
                </span>

                <span
                  className={`
                    font-mono
                    text-[10px]
                    tracking-wider
                    transition-colors
                    ${
                      isActive
                        ? e.classes.text
                        : "text-[#85745d]"
                    }
                  `}
                >
                  {e.range}
                </span>
              </button>
            );
          })}
        </aside>

        {/* ═══════════════════════════════
            MAIN COLUMN
        ═══════════════════════════════ */}

        <div
          className="
            relative
            flex-1
            min-h-screen
            bg-[#e8d8b8]
          "
        >
          {/* ═══════════════════════════════
              TOOLBAR
          ═══════════════════════════════ */}

          <div
            className="
              relative
              z-20
              flex
              flex-wrap
              items-center
              gap-3
              border-b
              border-[#9b835e]
              bg-[#f3e8cf]/95
              p-4
              md:p-5
            "
          >
            {/* Search */}

            <div
              className="
                relative
                min-w-[180px]
                flex-1
              "
            >
              <svg
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-[#85745d]
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
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
                  setSearchTerm(
                    e.target.value
                  );
                  resetSelection();
                }}
                className={`
                  w-full
                  rounded-[3px]
                  border
                  border-[#9b835e]
                  bg-[#f8efdc]
                  py-2
                  pl-9
                  pr-3
                  text-sm
                  text-[#2b2118]
                  placeholder:text-[#85745d]
                  outline-none
                  transition-all
                  focus:bg-[#fff7e7]
                  focus:ring-1
                  ${era.classes.ring}
                `}
              />
            </div>

            {/* Country */}

            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(
                    e.target.value
                  );
                  resetSelection();
                }}
                className={`
                  appearance-none
                  rounded-[3px]
                  border
                  border-[#9b835e]
                  bg-[#f3e8cf]
                  py-2
                  pl-3
                  pr-8
                  text-sm
                  text-[#2b2118]
                  outline-none
                  transition-colors
                  focus:ring-1
                  ${era.classes.ring}
                `}
              >
                <option value="">
                  All countries
                </option>

                {availableCountries.map(
                  (country) => (
                    <option
                      key={country}
                      value={country}
                    >
                      {country}
                    </option>
                  )
                )}
              </select>

              <svg
                className="
                  pointer-events-none
                  absolute
                  right-2.5
                  top-1/2
                  h-3.5
                  w-3.5
                  -translate-y-1/2
                  text-[#85745d]
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
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
              className="
                rounded-[3px]
                border
                border-[#9b835e]
                bg-[#f3e8cf]
                px-3
                py-2
                text-sm
                text-[#5a4935]
                transition-all
                hover:bg-[#e8d8b8]
                hover:text-[#2b2118]
              "
            >
              Clear
            </button>

            {/* Result counter */}

            <div
              className="
                ml-auto
                flex
                items-center
                gap-2
                border
                border-[#9b835e]
                bg-[#d2bd91]/60
                px-3
                py-1.5
                rounded-[3px]
              "
            >
              <span
                className={`
                  h-2
                  w-2
                  rounded-full
                  ${era.classes.bgActive}
                `}
              />

              <span
                className="
                  font-mono
                  text-xs
                  text-[#5a4935]
                "
              >
                <span
                  className={`
                    font-semibold
                    ${era.classes.textActive}
                  `}
                >
                  {filteredDinosaurs.length}
                </span>{" "}
                fossil occurrences
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════
              MAP
          ═══════════════════════════════ */}

          <div
            className="
              relative
              min-h-[calc(100vh-96px)]
              overflow-hidden
              bg-[#e8d8b8]
            "
          >
            {/* Decorative map texture */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                opacity-30
              "
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(74,55,32,0.16) 0.6px, transparent 0.6px)",
                backgroundSize: "10px 10px",
              }}
            />

            {/* Small map label */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-5
                left-5
                z-10
                hidden
                border
                border-[#9b835e]/70
                bg-[#f3e8cf]/80
                px-3
                py-2
                md:block
              "
            >
              <p
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-[#85745d]
                "
              >
                Fossil Occurrence Map
              </p>

              <p
                className="
                  mt-1
                  font-serif
                  text-xs
                  italic
                  text-[#5a4935]
                "
              >
                Jurassic Atlas Archive
              </p>
            </div>

            {/* Dinosaur card */}

            {selectedLocation && (
              <DinosaursCard
                dinosaur={selectedLocation}
                onClose={resetSelection}
              />
            )}

            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{
                scale: 150,
              }}
              className="
                relative
                z-[1]
                block
                h-[calc(100vh-96px)]
                w-full
              "
            >
              <ZoomableGroup
                minZoom={1}
                maxZoom={8}
                onMoveEnd={({ zoom }) =>
                  setZoom(zoom)
                }
              >
                <CountryLayer />

                {/* Fossil markers */}

                {filteredDinosaurs.map(
                  (dinosaur) => {
                    const isSelected =
                      selectedLocation?.occurrenceId ===
                      dinosaur.occurrenceId;

                    const isHovered =
                      hoveredId ===
                      dinosaur.occurrenceId;

                    const r = Math.max(
                      1,
                      3 / zoom
                    );

                    return (
                      <Marker
                        key={
                          dinosaur.occurrenceId
                        }
                        coordinates={
                          dinosaur.location
                            .coordinates
                            .coordinates
                        }
                      >
                        {/* Selected marker */}

                        {isSelected && (
                          <circle
                            r={r * 2.4}
                            className={`
                              ${era.classes.fill}
                              opacity-30
                              animate-ping
                            `}
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
                            stroke-[#f3e8cf]
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
                  }
                )}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;