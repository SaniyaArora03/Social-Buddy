import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FormPage() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/" + choice);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F3ECFF, #FFFFFF)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* CARD */}
      <div
        style={{
          background: "white",
          width: "450px",
          padding: "35px",
          borderRadius: "22px",
          boxShadow: "0 15px 35px rgba(127, 86, 217, 0.15)",
          border: "1px solid #EEE",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "700",
            marginBottom: "25px",
            textAlign: "left",
            background: "linear-gradient(90deg, #7F56D9, #9E77ED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hello! 👋 <br />
          Ready to start learning?
        </h2>

        {/* NAME */}
        <label
          style={{
            fontWeight: "600",
            color: "#5A5A5A",
            fontSize: "15px",
          }}
        >
          Name
        </label>
        <input
          type="text"
          required
          placeholder="Enter name"
          style={{
            width: "100%",
            padding: "12px 15px",
            borderRadius: "12px",
            border: "1px solid #DDD",
            background: "#F9F8FF",
            marginTop: "6px",
            marginBottom: "18px",
            fontSize: "15px",
            transition: "0.2s",
          }}
        />

        {/* AGE */}
        <label
          style={{
            fontWeight: "600",
            color: "#5A5A5A",
            fontSize: "15px",
          }}
        >
          Age
        </label>
        <input
          type="number"
          placeholder="Enter age"
          style={{
            width: "100%",
            padding: "12px 15px",
            borderRadius: "12px",
            border: "1px solid #DDD",
            background: "#F9F8FF",
            marginTop: "6px",
            marginBottom: "24px",
            fontSize: "15px",
            transition: "0.2s",
          }}
        />

        {/* LEARNING MODULE */}
        <h3
          style={{
            marginBottom: "12px",
            color: "#4A4A4A",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          Select Learning Module
        </h3>

        <form onSubmit={handleSubmit}>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #CCC",
              background: "#FAF9FF",
              fontSize: "16px",
              marginBottom: "28px",
              cursor: "pointer",
              boxShadow: "0 6px 14px rgba(127, 86, 217, 0.10)",
            }}
          >
            <option value="">Select Module</option>
            <option value="autism">Autism</option>
            <option value="dyslexia">Dyslexia</option>
            <option value="dyscalculia">Dyscalculia</option>
          </select>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px 0",
              background: "linear-gradient(135deg, #7F56D9, #9E77ED)",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontWeight: "600",
              fontSize: "17px",
              cursor: "pointer",
              transition: "0.2s",
              boxShadow: "0 8px 18px rgba(127, 86, 217, 0.25)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}
