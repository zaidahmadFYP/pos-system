"use client"

import React from "react"
import { QrReader } from "react-qr-reader"

export const QRScannerModal = ({ isOpen, onClose, onScan }) => {
  const [error, setError] = React.useState(null)

  const handleScan = (result) => {
    if (result) {
      try {
        // Extract transaction ID from QR code data
        const transactionId = result?.text
        if (transactionId) {
          onScan(transactionId)
        } else {
          setError("Invalid QR code format. Expected Transaction ID.")
        }
      } catch (err) {
        setError("Failed to process QR code data.")
        console.error("QR scan error:", err)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#1E1E1E",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h3 style={{ color: "#FFA500", marginBottom: "15px", textAlign: "center" }}>Scan Transaction QR Code</h3>

        {error && (
          <div
            style={{
              color: "#FF4444",
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={handleScan}
          scanDelay={500}
          videoStyle={{ width: "100%", borderRadius: "4px" }}
        />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#FF4444",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default QRScannerModal
