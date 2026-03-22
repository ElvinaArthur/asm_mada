const styles = {
  pageLoader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "28px",
    background: "#fff",
  },
  spinnerRing: {
    position: "relative",
    width: "80px",
    height: "80px",
  },
  madaIcon: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  madaSvg: {
    width: "34px",
    height: "34px",
  },
  loaderBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  loaderLabel: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#888",
    margin: 0,
  },
  dots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    display: "inline-block",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#bbb",
  },
};

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&display=swap');

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes spin-reverse {
    to { transform: rotate(-360deg); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1);    opacity: 1;   }
    50%       { transform: scale(0.85); opacity: 0.7; }
  }
  @keyframes fade {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1;   }
  }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1;   }
  }

  .pl-ring-outer {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #E30B17;
    border-right-color: #E30B17;
    animation: spin 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .pl-ring-inner {
    position: absolute;
    inset: 11px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-bottom-color: #007B3A;
    border-left-color: #007B3A;
    animation: spin-reverse 0.75s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .pl-mada-icon {
    animation: pulse 1.6s ease-in-out infinite;
  }
  .pl-label {
    animation: fade 1.4s ease-in-out infinite;
  }
  .pl-dot-1 { animation: dot-bounce 1.4s ease-in-out infinite; }
  .pl-dot-2 { animation: dot-bounce 1.4s ease-in-out 0.2s infinite; }
  .pl-dot-3 { animation: dot-bounce 1.4s ease-in-out 0.4s infinite; }
`;

const MadagascarIcon = () => (
  <svg
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={styles.madaSvg}
  >
    <path
      d="
        M 17 2
        C 18.5 2.5, 20 4, 20.5 6
        C 21.5 8.5, 21 10, 22 12
        C 23 14, 23.5 15.5, 23 17.5
        C 22.5 19.5, 21 21, 20 23
        C 19 25, 19.5 27, 18.5 29
        C 17.5 31, 16 32, 15 30.5
        C 14 29, 14.5 27, 13.5 25
        C 12.5 23, 11.5 21.5, 11 19.5
        C 10.5 17.5, 11 15.5, 11.5 13.5
        C 12 11.5, 11.5 9.5, 12.5 7.5
        C 13.5 5.5, 15.5 1.5, 17 2 Z
      "
      fill="#F5C400"
      stroke="#C99B00"
      strokeWidth="0.6"
    />
  </svg>
);

export default function PageLoader() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.pageLoader}>
        <div style={styles.spinnerRing}>
          <div className="pl-ring-outer" />
          <div className="pl-ring-inner" />
          <div style={styles.madaIcon} className="pl-mada-icon">
            <MadagascarIcon />
          </div>
        </div>
        <div style={styles.loaderBottom}>
          <p style={styles.loaderLabel} className="pl-label">
            Chargement
          </p>
          <div style={styles.dots}>
            <span style={styles.dot} className="pl-dot-1" />
            <span style={styles.dot} className="pl-dot-2" />
            <span style={styles.dot} className="pl-dot-3" />
          </div>
        </div>
      </div>
    </>
  );
}
