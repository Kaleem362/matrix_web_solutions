import { useEffect, useState } from "react";

const CoverContactPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden flex items-center"
      style={{
        minHeight: "clamp(180px, 35vw, 380px)",
        background: "#0c0c14",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Purple glow — bottom center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Top-right envelope-like shape */}
      <div className="absolute top-0 right-0 opacity-80">
        <svg
          viewBox="0 0 120 80"
          className="w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-28"
        >
          <polygon points="0,0 120,0 60,50" fill="#7c3aed" opacity="0.7" />
          <polygon points="0,0 0,80 60,50" fill="#6d28d9" opacity="0.5" />
          <polygon points="120,0 120,80 60,50" fill="#5b21b6" opacity="0.5" />
        </svg>
      </div>

      {/* Bottom-left hexagon */}
      <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10 md:bottom-8 md:left-16">
        <svg
          viewBox="0 0 60 70"
          className="w-10 h-12 sm:w-14 sm:h-16 md:w-16 md:h-20"
          style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.4))" }}
        >
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <polygon points="30,0 60,17.5 60,52.5 30,70 0,52.5 0,17.5" fill="url(#hexGrad)" />
        </svg>
      </div>

      {/* Center-bottom ring */}
      <div
        className="absolute bottom-4 sm:bottom-6"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(40px, 7vw, 80px)",
          height: "clamp(40px, 7vw, 80px)",
          border: "clamp(4px, 0.8vw, 8px) solid #9333ea",
          borderRadius: "50%",
          opacity: 0.9,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 py-6 sm:py-8 md:py-10">
        {/* Top bar */}
        <div
          className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-14px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <span
            style={{
              color: "#d8b4fe",
              fontSize: "clamp(0.6rem, 1.5vw, 0.85rem)",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              fontWeight: 400,
            }}
          >
            www.matrixwebsolutions.com
          </span>
          <div
            className="flex-1"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.1) 100%)",
            }}
          />
          {/* Logo badge — md+ */}
          <div className="hidden md:block relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 180deg, #a855f7, #6d28d9, #312e81, #a855f7)",
                padding: "3px",
                boxShadow: "0 0 24px 4px rgba(168,85,247,0.5)",
              }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center relative"
                style={{ background: "#0a0a12" }}
              >
                <div className="flex justify-between w-full px-2 absolute top-2">
                  <span style={{ color: "#a855f7", fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.05em" }}>20</span>
                  <span style={{ color: "#a855f7", fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.05em" }}>25</span>
                </div>
                <span
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 900,
                    fontSize: "clamp(1.4rem, 4vw, 2rem)",
                    color: "#fff",
                    lineHeight: 1,
                    textShadow: "0 0 12px rgba(168,85,247,0.8)",
                  }}
                >
                  M
                </span>
                <div className="absolute bottom-2 flex justify-center w-full">
                  <span
                    style={{
                      fontSize: "0.32rem",
                      letterSpacing: "0.12em",
                      color: "#c084fc",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    WEB DEVELOPERS
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-full flex justify-center">
              <span
                style={{
                  fontSize: "0.38rem",
                  letterSpacing: "0.18em",
                  color: "#c084fc",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                MATRIXWEB
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="flex items-end justify-between gap-4">
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 700,
              lineHeight: 1.15,
              fontSize: "clamp(1.15rem, 3.8vw, 2.85rem)",
              maxWidth: "78%",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s",
            }}
          >
            Let's build something great together.
            <br className="hidden sm:block" />
            {" "}Reach out and our team will get back
            <br className="hidden sm:block" />
            {" "}to you within 24 hours.
          </h1>

          {/* Logo badge — small */}
          <div className="md:hidden relative shrink-0 w-16 h-16 sm:w-20 sm:h-20">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 180deg, #a855f7, #6d28d9, #312e81, #a855f7)",
                padding: "3px",
                boxShadow: "0 0 24px 4px rgba(168,85,247,0.5)",
              }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center relative"
                style={{ background: "#0a0a12" }}
              >
                <span
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    color: "#fff",
                    textShadow: "0 0 12px rgba(168,85,247,0.8)",
                  }}
                >
                  M
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade-in overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "#0c0c14",
          opacity: visible ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
};

export default CoverContactPage;

