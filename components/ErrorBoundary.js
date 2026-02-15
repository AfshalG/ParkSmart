"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Something went wrong" };
  }

  componentDidCatch(error, info) {
    console.error("ParkSmart error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: "24px",
            padding: "20px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <p style={{ color: "#FCA5A5", fontWeight: 700, marginBottom: 4 }}>
            Something went wrong
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: null })}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.1)",
              color: "#FCA5A5",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
