import { useEffect, useState } from "react";

const CoverBlogPage = () => {
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

      {/* Purple glow — top right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 85% 20%, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Top-right pen/pencil shape */}
      <div className="absolute top-0 right-0 opacity-80">
        <svg
          viewBox="0 0 80 100"
          className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28"
        >
          <defs>
            <linearGradient id="penGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
          <polygon points="20,0 60,0 80,80 40,100 0,80" fill="url(#penGrad)" />
        </svg>
      </div>

      {/* Bottom-left stacked lines (paragraph icon) */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 md:bottom-10 md:left-16 flex flex-col gap-1 sm:gap-1.5 opacity-80">
        {[100, 70, 85, 55].map((w, i) => (
          <div
            key={i}
            style={{
              width: `clamp(${w * 0.3}px, ${w * 0.08}vw, ${w * 0.6}px)`,
              height: "clamp(3px, 0.5vw, 5px)",
              background: i === 0 ? "#a855f7" : "#6d28d9",
              borderRadius: "2px",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Center-bottom oval */}
      <div
        className="absolute bottom-3 sm:bottom-4"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(60px, 10vw, 100px)",
          height: "clamp(20px, 3.5vw, 36px)",
          background: "#9333ea",
          borderRadius: "50%",
          opacity: 0.85,
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
            Insights, tips and stories from
            <br className="hidden sm:block" />
            {" "}the Matrix Web team — written
            <br className="hidden sm:block" />
            {" "}to help your business thrive.
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

export default CoverBlogPage;

