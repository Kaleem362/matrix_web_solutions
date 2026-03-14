import { useEffect, useState } from "react";
// import { useStore } from "../src/Context/UseStore";
// import ourservicescoverimage from "../Elements/images/ourservicescoverimage.png";

const CoverOurServicesPage = () => {
  const [visible, setVisible] = useState(false);
  // const { theme } = useStore();

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
      {/* Subtle dark texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Soft purple radial glow on the left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 80% at 20% 60%, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Decorative Shapes ── */}

      {/* Top-left 4-point star */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 md:top-10 md:left-16 opacity-80">
        <svg width="48" height="48" viewBox="0 0 60 60" className="sm:w-14 sm:h-14 md:w-16 md:h-16">
          <path
            d="M30 0 C30 0 33 22 30 30 C30 30 52 27 60 30 C60 30 38 33 30 30 C30 30 33 52 30 60 C30 60 27 38 30 30 C30 30 8 33 0 30 C0 30 22 27 30 30 C30 30 27 8 30 0Z"
            fill="#5b21b6"
          />
        </svg>
      </div>

      {/* Bottom-left large C/bracket shape */}
      <div
        className="absolute bottom-0 left-0 w-20 h-24 sm:w-24 sm:h-28 md:w-32 md:h-36 opacity-90"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          borderRadius: "0 60% 60% 0",
          transform: "translateX(-30%)",
        }}
      />

      {/* Purple number 7 shape bottom-left */}
      <div
        className="absolute bottom-0 left-10 sm:left-14 md:left-20 opacity-90"
        style={{
          width: "clamp(30px, 5vw, 55px)",
          height: "clamp(50px, 9vw, 100px)",
          background: "linear-gradient(160deg, #7c3aed, #4c1d95)",
          clipPath: "polygon(0% 0%, 100% 0%, 60% 100%, 40% 100%)",
        }}
      />

      {/* Center circle */}
      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(40px, 7vw, 80px)",
          height: "clamp(40px, 7vw, 80px)",
          background: "#9333ea",
          borderRadius: "50%",
          opacity: 0.95,
        }}
      />

      {/* Right gradient triangle */}
      <div className="absolute right-6 sm:right-10 md:right-16 bottom-4 sm:bottom-6 md:bottom-8">
        <svg
          viewBox="0 0 90 110"
          className="w-10 h-12 sm:w-14 sm:h-16 md:w-20 md:h-24"
          style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.4))" }}
        >
          <defs>
            <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <polygon points="45,110 0,0 90,0" fill="url(#triGrad)" />
        </svg>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full flex flex-col px-6 sm:px-10 md:px-16 lg:px-24 py-6 sm:py-8 md:py-10">

        {/* Top bar: URL + divider line + Logo */}
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

          {/* Horizontal divider line */}
          <div
            className="flex-1"
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.1) 100%)",
            }}
          />

          {/* Logo badge — md and above */}
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

        {/* Headline + small-screen logo */}
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
            Matrix Web Solutions provides complete
            <br className="hidden sm:block" />
            {" "}digital services to help your business grow in
            <br className="hidden sm:block" />
            {" "}the online world.
          </h1>

          {/* Logo badge — small screens only */}
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
                <div className="flex justify-between w-full px-2 absolute top-2">
                  <span style={{ color: "#a855f7", fontSize: "0.4rem", fontWeight: 700 }}>20</span>
                  <span style={{ color: "#a855f7", fontSize: "0.4rem", fontWeight: 700 }}>25</span>
                </div>
                <span
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    color: "#fff",
                    lineHeight: 1,
                    textShadow: "0 0 12px rgba(168,85,247,0.8)",
                  }}
                >
                  M
                </span>
                <div className="absolute bottom-1 flex justify-center w-full">
                  <span style={{ fontSize: "0.28rem", letterSpacing: "0.1em", color: "#c084fc", textTransform: "uppercase", fontWeight: 600 }}>
                    WEB DEVS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade-in overlay (animates away on mount) */}
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

export default CoverOurServicesPage;