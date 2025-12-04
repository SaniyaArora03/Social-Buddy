export default function AutismPage() {
  return (
    <div>
      {/* Styled Play Games Button */}
      <div style={{ padding: "20px", textAlign: "right" }}>
        <a 
          href="/games/games-for-social-buddy/index.html" 
          target="_blank"
          style={{
            padding: "12px 20px",
            background: "linear-gradient(135deg, #7F56D9, #9E77ED)",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            transition: "all 0.2s ease",
            display: "inline-block"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
          }}
        >
          🎮 Play Games
        </a>
      </div>

      {/* Autism Dashboard Iframe */}
      <iframe
        src="/autism-dashboard/frontend/index.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
    </div>
  );
}
