import React, { useState } from "react";

/* ─────────────────────────────────────
   COUNTRY NAME
───────────────────────────────────── */

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

/* ─────────────────────────────────────
   ANCIENT ERA PALETTE
───────────────────────────────────── */

const ERA_ACCENT = {
  Triassic: {
    bar: "bg-[#8b3e32]",
    label: "text-[#7f3f2f]",
    tag: "bg-[#e7cfc1] text-[#6f3329]",
    ring: "ring-[#8b3e32]",
    soft: "bg-[#f0dfd2]",
  },

  Jurassic: {
    bar: "bg-[#536b4f]",
    label: "text-[#344634]",
    tag: "bg-[#d8e0d1] text-[#344634]",
    ring: "ring-[#536b4f]",
    soft: "bg-[#e3e9df]",
  },

  Cretaceous: {
    bar: "bg-[#8b6048]",
    label: "text-[#684333]",
    tag: "bg-[#e3d3c4] text-[#684333]",
    ring: "ring-[#8b6048]",
    soft: "bg-[#eee2d6]",
  },
};

/* ─────────────────────────────────────
   FIELD LABEL
───────────────────────────────────── */

const FIELD_LABEL =
  "font-mono text-[10px] uppercase tracking-[0.16em] text-[#85745d]";

/* ─────────────────────────────────────
   FIELD DATA ROW
───────────────────────────────────── */

const Field = ({ label, value }) => (
  <div
    className="
      group
      flex
      items-start
      justify-between
      gap-4
      border-b
      border-dotted
      border-[#9b835e]/60
      py-2.5
    "
  >
    <span
      className={`${FIELD_LABEL} shrink-0 pt-0.5`}
    >
      {label}
    </span>

    <span
      className="
        max-w-[68%]
        text-right
        text-sm
        leading-relaxed
        text-[#5a4935]
        transition-colors
        group-hover:text-[#2b2118]
      "
    >
      {value}
    </span>
  </div>
);

/* ─────────────────────────────────────
   DINOSAUR CARD
───────────────────────────────────── */

const DinosaursCard = ({ dinosaur, onClose }) => {
  const accent =
    ERA_ACCENT[dinosaur.period] ||
    ERA_ACCENT.Jurassic;

  const hasImage = Boolean(
    dinosaur.image?.url
  );

  /* ─────────────────────────────────
     T-REXAI STATE
  ───────────────────────────────── */

  const [showAI, setShowAI] =
    useState(false);

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loadingAI, setLoadingAI] =
    useState(false);

  /* ─────────────────────────────────
     ASK T-REXAI
  ───────────────────────────────── */

  const askTRexAI = async () => {
    if (!question.trim()) return;

    try {
      setLoadingAI(true);
      setAnswer("");

      const API_URL = (import.meta.env.VITE_API_URL || "https://jurassic-atlas.onrender.com").replace(/\/+$/, "");
      const response = await fetch(
        `${API_URL}/api/dinosaurs/${dinosaur._id}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question:
              question.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to get AI answer"
        );
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(
        "T-RexAI error:",
        error
      );

      setAnswer(
        "Sorry, T-RexAI couldn't answer right now. Please try again."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  /* ─────────────────────────────────
     SUGGESTED QUESTIONS
  ───────────────────────────────── */

  const suggestedQuestions = [
    "What did this dinosaur eat?",
    "How big was this dinosaur?",
    "When did it live?",
    "Where did it live?",
  ];

  const useSuggestedQuestion = (
    suggestedQuestion
  ) => {
    setQuestion(suggestedQuestion);
  };

  return (
    <>
      {/* ═══════════════════════════════
          SPECIMEN CARD
      ═══════════════════════════════ */}

      <div
      className="
        specimen-scroll
        absolute
        top-5
        right-5
        z-50
        w-[22rem]
        max-w-[calc(100vw-2rem)]
        max-h-[calc(100vh-2.5rem)]
        overflow-y-auto
        overflow-x-hidden
        border
        border-[#9b835e]
        bg-[#f3e8cf]
        shadow-[0_20px_55px_-18px_rgba(43,33,24,0.65)]
        animate-[fadeIn_0.2s_ease-out]
      "
      style={{
        fontFamily:
          "Georgia, 'Times New Roman', serif",
      }}
    >
        {/* ─────────────────────────
            ERA BAR
        ───────────────────────── */}

        <div
          className={`h-1.5 w-full ${accent.bar}`}
        />

        <div className="relative p-5">

          {/* Decorative corner marks */}

          <div
            className="
              pointer-events-none
              absolute
              left-2
              top-2
              h-3
              w-3
              border-l
              border-t
              border-[#9b835e]/60
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-2
              right-2
              h-3
              w-3
              border-b
              border-r
              border-[#9b835e]/60
            "
          />

          {/* ─────────────────────────
              CLOSE
          ───────────────────────── */}

          <button
            onClick={onClose}
            aria-label="Close specimen"
            className="
              absolute
              right-4
              top-4
              flex
              h-7
              w-7
              items-center
              justify-center
              border
              border-[#9b835e]/60
              bg-[#e8d8b8]
              text-lg
              leading-none
              text-[#5a4935]
              transition-all
              duration-200
              hover:bg-[#d2bd91]
              hover:text-[#2b2118]
            "
          >
            ×
          </button>

          {/* ─────────────────────────
              HEADER
          ───────────────────────── */}

          <div className="pr-8">

            <p
              className={`${FIELD_LABEL} mb-1`}
            >
              Specimen Record
            </p>

            <h2
              className="
                mb-3
                font-serif
                text-[1.65rem]
                font-semibold
                leading-[1.05]
                tracking-tight
                text-[#2b2118]
              "
            >
              {dinosaur.name}
            </h2>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#9b835e]
                "
              />

              <span
                className={`
                  font-mono
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  ${accent.label}
                `}
              >
                {dinosaur.period ||
                  "Unknown period"}
              </span>
            </div>
          </div>

          {/* ─────────────────────────
              DIVIDER
          ───────────────────────── */}

          <div
            className="
              my-4
              flex
              items-center
              gap-2
            "
          >
            <span className="h-px flex-1 bg-[#9b835e]/50" />

            <span
              className="
                text-[9px]
                text-[#85745d]
              "
            >
              ◆
            </span>

            <span className="h-px flex-1 bg-[#9b835e]/50" />
          </div>

          {/* ─────────────────────────
              IMAGE
          ───────────────────────── */}

          <div
            className={`
              group
              relative
              mb-4
              overflow-hidden
              border
              border-[#9b835e]/70
              bg-[#e7dfcf]
              ring-1
              ring-inset
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
                    bg-[#e7dfcf]
                    transition-transform
                    duration-500
                    group-hover:scale-[1.02]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#5a4935]/10
                    via-transparent
                    to-[#fff8e8]/20
                  "
                />
              </>
            ) : (
              <div
                className="
                  flex
                  h-52
                  w-full
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  border-dashed
                  border-[#9b835e]
                  bg-[#e8d8b8]
                  text-[#85745d]
                "
              >
                <span className="text-3xl opacity-60">
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

          {/* ─────────────────────────
              IMAGE SOURCE
          ───────────────────────── */}

          {hasImage && (
            <div
              className="
                mb-5
                border
                border-[#9b835e]/60
                bg-[#e8d8b8]/60
                px-3
                py-2.5
              "
            >
              <p className={FIELD_LABEL}>
                Image Source
              </p>

              <div
                className="
                  mt-1
                  flex
                  flex-wrap
                  items-center
                  gap-1.5
                  text-[10px]
                  text-[#5a4935]
                "
              >
                {dinosaur.image.source ? (
                  <a
                    href={
                      dinosaur.image.source
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      font-medium
                      underline
                      decoration-[#9b835e]
                      underline-offset-2
                      hover:text-[#2b2118]
                    "
                  >
                    Wikimedia Commons
                  </a>
                ) : (
                  <span>
                    Wikimedia Commons
                  </span>
                )}

                {dinosaur.image.license && (
                  <>
                    <span className="text-[#9b835e]">
                      •
                    </span>

                    <span>
                      {
                        dinosaur.image
                          .license
                      }
                    </span>
                  </>
                )}
              </div>

              {dinosaur.image
                .attribution && (
                <p
                  className="
                    mt-1
                    truncate
                    text-[9px]
                    leading-relaxed
                    text-[#85745d]
                  "
                  title={
                    dinosaur.image
                      .attribution
                  }
                >
                  {dinosaur.image.attribution.replace(
                    /<[^>]*>/g,
                    ""
                  )}
                </p>
              )}
            </div>
          )}

          {/* ─────────────────────────
              FOSSIL DATA
          ───────────────────────── */}

          <div className="mb-4">

            <Field
              label="Country"
              value={getCountryName(
                dinosaur.location
                  ?.country
              )}
            />

            <Field
              label="Region"
              value={
                dinosaur.location
                  ?.region ||
                "Unknown"
              }
            />

            <Field
              label="Locality"
              value={
                dinosaur.location
                  ?.locality ||
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

          {/* ─────────────────────────
              DESCRIPTION
          ───────────────────────── */}

          {dinosaur.description && (
            <div
              className="
                mb-4
                border-l-2
                border-[#9b835e]
                bg-[#e8d8b8]/50
                px-3
                py-2.5
              "
            >
              <p
                className="
                  text-sm
                  leading-relaxed
                  text-[#5a4935]
                "
              >
                {dinosaur.description}
              </p>
            </div>
          )}

          {/* ─────────────────────────
              T-REXAI
          ───────────────────────── */}

          <button
            onClick={() =>
              setShowAI(true)
            }
            className="
              mb-2
              w-full
              border
              border-[#536b4f]
              bg-[#536b4f]
              px-4
              py-2.5
              text-sm
              font-medium
              tracking-wide
              text-[#f3e8cf]
              shadow-sm
              transition-all
              duration-200
              hover:bg-[#344634]
              hover:shadow-md
            "
          >
            🦖 Ask T-RexAI
          </button>

          {/* ─────────────────────────
              CLOSE SPECIMEN
          ───────────────────────── */}

          <button
            onClick={onClose}
            className="
              w-full
              border
              border-[#9b835e]
              bg-[#2b2118]
              px-4
              py-2.5
              text-sm
              font-medium
              tracking-wide
              text-[#f3e8cf]
              transition-all
              duration-200
              hover:bg-[#463528]
            "
          >
            Close Specimen
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════
          T-REXAI MODAL
      ═══════════════════════════════ */}

    {showAI && (
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          overflow-y-auto
          bg-[#2b2118]/65
          p-4
        "
      >
        <div
          className="
            relative
            my-auto
            w-full
            max-w-lg
            max-h-[calc(100vh-2rem)]
            overflow-y-auto
            overflow-x-hidden
            border
            border-[#9b835e]
            bg-[#f3e8cf]
            shadow-[0_25px_70px_-18px_rgba(43,33,24,0.75)]
          "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >

            {/* Top accent */}

            <div
              className={`
                h-1.5
                w-full
                ${accent.bar}
              `}
            />

            {/* Decorative corners */}

            <div
              className="
                pointer-events-none
                absolute
                left-2
                top-2
                h-4
                w-4
                border-l
                border-t
                border-[#9b835e]/60
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-2
                right-2
                h-4
                w-4
                border-b
                border-r
                border-[#9b835e]/60
              "
            />

            {/* ─────────────────────────
                MODAL HEADER
            ───────────────────────── */}

            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-[#9b835e]/60
                px-5
                py-4
              "
            >
              <div>

                <p className={FIELD_LABEL}>
                  Jurassic Atlas Archive
                </p>

                <h3
                  className="
                    mt-1
                    font-serif
                    text-xl
                    font-semibold
                    text-[#2b2118]
                  "
                >
                  T-RexAI
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    italic
                    text-[#85745d]
                  "
                >
                  Digital Paleontological
                  Assistant
                </p>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span className="h-px w-6 bg-[#9b835e]" />

                  <span
                    className="
                      font-mono
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-[#85745d]
                    "
                  >
                    {dinosaur.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowAI(false)
                }
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  border
                  border-[#9b835e]/60
                  bg-[#e8d8b8]
                  text-lg
                  text-[#5a4935]
                  transition-colors
                  hover:bg-[#d2bd91]
                "
                aria-label="Close T-RexAI"
              >
                ×
              </button>
            </div>

            {/* ─────────────────────────
                QUESTION AREA
            ───────────────────────── */}

            <div className="p-5">

              <label
                className={`
                  ${FIELD_LABEL}
                  mb-2
                  block
                `}
              >
                Research Question
              </label>

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();

                    if (
                      question.trim() &&
                      !loadingAI
                    ) {
                      askTRexAI();
                    }
                  }
                }}
                placeholder={`Ask about ${dinosaur.name}...`}
                rows={3}
                className="
                  w-full
                  resize-none
                  border
                  border-[#9b835e]
                  bg-[#f8efdc]
                  px-3
                  py-3
                  text-sm
                  leading-relaxed
                  text-[#2b2118]
                  placeholder:text-[#85745d]
                  outline-none
                  transition
                  focus:bg-[#fff8e8]
                  focus:ring-1
                  focus:ring-[#536b4f]
                "
              />

              {/* ─────────────────────────
                  SUGGESTIONS
              ───────────────────────── */}

              <div className="mt-3">

                <p
                  className="
                    mb-2
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-[#85745d]
                  "
                >
                  Suggested questions
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-1.5
                  "
                >
                  {suggestedQuestions.map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() =>
                          useSuggestedQuestion(
                            item
                          )
                        }
                        className="
                          border
                          border-[#9b835e]/70
                          bg-[#e8d8b8]/50
                          px-2.5
                          py-1.5
                          text-left
                          text-[10px]
                          text-[#5a4935]
                          transition-colors
                          hover:bg-[#d2bd91]
                          hover:text-[#2b2118]
                        "
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* ─────────────────────────
                  ASK BUTTON
              ───────────────────────── */}

              <button
                onClick={askTRexAI}
                disabled={
                  loadingAI ||
                  !question.trim()
                }
                className="
                  mt-4
                  w-full
                  border
                  border-[#536b4f]
                  bg-[#536b4f]
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  tracking-wide
                  text-[#f3e8cf]
                  transition-all
                  hover:bg-[#344634]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loadingAI
                  ? "T-RexAI is examining the record..."
                  : "Ask T-RexAI"}
              </button>

              {/* ─────────────────────────
                  AI RESPONSE
              ───────────────────────── */}

              {answer && (
                <div
                  className="
                    mt-5
                    border
                    border-[#9b835e]/70
                    bg-[#e8d8b8]/55
                    px-4
                    py-3.5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        h-px
                        w-5
                        bg-[#9b835e]
                      "
                    />

                    <p
                      className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#85745d]
                      "
                    >
                      T-RexAI Field Notes
                    </p>
                  </div>

                  <p
                    className="
                      mt-3
                      max-h-72
                      overflow-y-auto
                      whitespace-pre-wrap
                      text-sm
                      leading-relaxed
                      text-[#4c3d2d]
                    "
                  >
                    {answer}
                  </p>
                </div>
              )}

              {/* Small footer */}

              <p
                className="
                  mt-4
                  text-center
                  font-mono
                  text-[8px]
                  uppercase
                  tracking-[0.12em]
                  text-[#9b835e]
                "
              >
                AI-generated research assistance
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DinosaursCard;