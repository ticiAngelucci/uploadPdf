import React, { useRef, useEffect, useState } from "react";
import { Button } from "@mui/material";
import PDFViewer from "./PDFViewer";
import "./index.css";

export default function PDFUploadForm() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // 🔲 Dibuja la grilla al montar el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = 20; // tamaño de cada celda

    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, []);

  // 📍 Función para empezar a dibujar
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);
    setLastPos({ x: offsetX, y: offsetY });

    // Vibra al comenzar
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // ✏️ Función para dibujar mientras se arrastra
  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = getCoordinates(e);

    ctx.strokeStyle = "#1976d2";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setLastPos({ x: offsetX, y: offsetY });
  };

  // 🖌️ Función para dejar de dibujar
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 📐 Función para obtener coordenadas tanto en mouse como touch
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dibujá sobre la grilla 📐</h2>

      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      ></canvas>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Redibuja la grilla después de borrar
          const cellSize = 20;
          ctx.strokeStyle = "#e0e0e0";
          ctx.lineWidth = 0.5;
          for (let x = 0; x <= canvas.width; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y <= canvas.height; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
        }}
      >
        Borrar dibujo
      </Button>
    </div>
  );
}
