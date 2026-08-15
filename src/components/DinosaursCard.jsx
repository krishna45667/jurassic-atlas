import React from "react";

const getCountryName = (code) => {
  if (!code) return "Unknown";

  try {
    const regionNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    return regionNames.of(code) || code;
  } catch {
    return code;
  }
};

// Era palette
const ERA_ACCENT = {
  Triassic: {
    bar: "bg-orange-600",
    label: "text-orange-700",
    tag: "bg-orange-100 text-orange-800",
    ring: "ring-orange-500",
    soft: "bg-orange-50",
  },

  Jurassic: {
    bar: "bg-emerald-600",
    label: "text-emerald-700",
    tag: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-500",
    soft: "bg-emerald-50",
  },

  Cretaceous: {
    bar: "bg-rose-600",
    label: "text-rose-700",
    tag: "bg-rose-100 text-rose-800",
    ring: "ring-rose-500",
    soft: "bg-rose-50",
  },
};

const FIELD_LABEL =
  "font-mono text-[10px] uppercase tracking-[0.15em] text-stone-400";

const Field = ({ label, value }) => (
  <div className="group flex items-start justify-between gap-4 border-b border-dotted border-stone-300 py-2.5">
    <span className={`${FIELD_LABEL} pt-0.5 shrink-0`}>
      {label}
    </span>

    <span className="max-w-[68%] text-right text-sm leading-relaxed text-stone-700 transition-colors group-hover:text-stone-950">
      {value}
    </span>
  </div>
);

const DinosaursCard = ({ dinosaur, onClose }) => {
  const accent =
    ERA_ACCENT[dinosaur.period] || ERA_ACCENT.Jurassic;

  const hasImage = Boolean(dinosaur.image?.url);

  return (
    <div
      className="
        absolute top-5 right-5 z-50
        w-[22rem] max-w-[calc(100vw-2rem)]
        overflow-hidden
        rounded-xl
        border border-stone-200/80
        bg-[#FBF7EE]
        shadow-[0_25px_70px_-18px_rgba(0,0,0,0.65)]
        animate-[fadeIn_0.2s_ease-out]
      "
      style={{
        fontFamily: "ui-serif, Georgia, serif",
      }}
    >
      {/* ─────────────────────────────
          ERA ACCENT BAR
      ───────────────────────────── */}
      <div
        className={`h-1.5 w-full ${accent.bar}`}
      />

      <div className="relative p-5">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close specimen"
          className="
            absolute right-4 top-4
            flex h-8 w-8 items-center justify-center
            rounded-full
            text-lg text-stone-400
            transition-all duration-200
            hover:bg-stone-200
            hover:text-stone-800
            hover:rotate-90
          "
        >
          ×
        </button>

        {/* ─────────────────────────────
            HEADER
        ───────────────────────────── */}
        <div className="pr-8">
          <p
            className={`${FIELD_LABEL} mb-1`}
          >
            Specimen
          </p>

          <h2
            className="
              mb-3
              font-serif
              text-[1.7rem]
              font-semibold
              leading-[1.05]
              tracking-tight
              text-stone-900
            "
          >
            {dinosaur.name}
          </h2>

          <span
            className={`
              inline-flex items-center
              rounded-full
              px-3 py-1
              font-mono
              text-[10px]
              font-medium
              uppercase
              tracking-[0.12em]
              ${accent.tag}
            `}
          >
            {dinosaur.period || "Unknown period"}
          </span>
        </div>

        {/* ─────────────────────────────
            IMAGE
        ───────────────────────────── */}
        <div
          className={`
            group
            relative
            mt-5
            mb-4
            overflow-hidden
            rounded-lg
            bg-stone-100
            ring-1 ring-inset
            ${accent.ring}/20
          `}
        >
          {hasImage ? (
            <>
              <img
                src={dinosaur.image.url}
                alt={`${dinosaur.name} reconstruction`}
                className="
                  block
                  h-52
                  w-full
                  object-contain
                  bg-stone-100
                  transition-transform
                  duration-500
                  group-hover:scale-[1.02]
                "
              />

              {/* subtle image overlay */}
              <div
                className="
                  pointer-events-none
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/5
                  via-transparent
                  to-white/10
                "
              />
            </>
          ) : (
            <div
              className="
                flex h-52 w-full
                flex-col
                items-center
                justify-center
                gap-2
                border border-dashed
                border-stone-300
                bg-stone-100
                text-stone-400
              "
            >
              <span className="text-3xl opacity-70">
                🦴
              </span>

              <span
                className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                "
              >
                No image available
              </span>
            </div>
          )}
        </div>

        {/* ─────────────────────────────
            IMAGE CREDIT
        ───────────────────────────── */}
        {hasImage && (
          <div
            className="
              mb-5
              rounded-md
              border border-stone-200
              bg-stone-100/60
              px-3 py-2
            "
          >
            <p
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-stone-400
              "
            >
              Image source
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500">
              {dinosaur.image.source ? (
                <a
                  href={dinosaur.image.source}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    font-medium
                    text-stone-700
                    underline
                    decoration-stone-300
                    underline-offset-2
                    transition-colors
                    hover:text-stone-950
                  "
                >
                  Wikimedia Commons
                </a>
              ) : (
                <span>Wikimedia Commons</span>
              )}

              {dinosaur.image.license && (
                <>
                  <span className="text-stone-300">
                    •
                  </span>

                  <span>
                    {dinosaur.image.license}
                  </span>
                </>
              )}
            </div>

            {dinosaur.image.attribution && (
              <p
                className="
                  mt-1
                  truncate
                  text-[9px]
                  leading-relaxed
                  text-stone-400
                "
                title={dinosaur.image.attribution}
              >
                {dinosaur.image.attribution
                  .replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>
        )}

        {/* ─────────────────────────────
            FOSSIL DATA
        ───────────────────────────── */}
        <div className="mb-4">
          <Field
            label="Country"
            value={getCountryName(
              dinosaur.location?.country
            )}
          />

          <Field
            label="Region"
            value={
              dinosaur.location?.region ||
              "Unknown"
            }
          />

          <Field
            label="Locality"
            value={
              dinosaur.location?.locality ||
              "Unknown"
            }
          />

          <Field
            label="Formation"
            value={
              dinosaur.formation ||
              "Unknown"
            }
          />
        </div>

        {/* ─────────────────────────────
            DESCRIPTION
        ───────────────────────────── */}
        {dinosaur.description && (
          <div
            className="
              mb-4
              rounded-lg
              border-l-2
              border-stone-300
              bg-stone-100/50
              px-3 py-2.5
            "
          >
            <p
              className="
                text-sm
                leading-relaxed
                text-stone-600
              "
              style={{
                fontFamily:
                  "ui-sans-serif, system-ui",
              }}
            >
              {dinosaur.description}
            </p>
          </div>
        )}

        {/* ─────────────────────────────
            CLOSE BUTTON
        ───────────────────────────── */}
        <button
          onClick={onClose}
          className="
            w-full
            rounded-lg
            bg-stone-900
            px-4 py-2.5
            text-sm
            font-medium
            text-stone-50
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-stone-800
            hover:shadow-md
            active:translate-y-0
          "
        >
          Close specimen
        </button>
      </div>
    </div>
  );
};

export default DinosaursCard;