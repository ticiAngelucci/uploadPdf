import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@mui/material";
import PDFViewer from "./PDFViewer";
import "./index.css";

export default function PDFUploadForm() {
  const sigCanvas = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setIsEmpty(true);
  };

  const handleSaveSignature = () => {
    if (!sigCanvas.current.isEmpty()) {
      // 📁 Imagen Base64
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

      // 📊 Puntos crudos (coordenadas, tiempo, velocidad, presión)
      const puntos = sigCanvas.current.toData();

      console.log("📄 Imagen Base64:", dataURL);
      console.log("📊 Puntos de la firma:", puntos);

      alert("✅ Firma guardada (ver consola para imagen y datos crudos)");
    } else {
      alert("✋ Por favor, dibuja una firma antes de guardar.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Sección de Firma */}
      <div
        style={{
          margin: "30px 0",
          border: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <h2>Área de Firma</h2>

        {/* Área de firma accesible */}
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 800,
            height: 300,
            className: "signature-canvas",
            role: "application",
            "aria-label":
              "Área de firma.",
            "aria-describedby": "signature-instructions",
            tabIndex: 0,
            style: {
              border: "1px solid black",
              width: "100%",
              height: "300px",
              touchAction: "none",
            },
          }}
          onEnd={() => setIsEmpty(sigCanvas.current.isEmpty())}
        />

        {/* Botones */}
        <div style={{ marginTop: "10px" }}>
          <Button
            onClick={handleClearSignature}
            variant="outlined"
            color="error"
            size="small"
            sx={{ marginRight: "10px" }}
          >
            Limpiar
          </Button>
          <Button
            onClick={handleSaveSignature}
            variant="contained"
            color="primary"
            size="small"
            disabled={isEmpty}
          >
            Guardar Firma
          </Button>
        </div>

        {/* Texto oculto para lectores de pantalla */}
        <div
          id="signature-instructions"
          style={{ display: "none" }}
          aria-hidden="true"
        >
          Para firmar, use su dedo o lápiz óptico para dibujar su firma en el área blanca.
        </div>
      </div>

      {/* Visor de PDF */}
      {fileUrl && <PDFViewer fileUrl={fileUrl} />}
    </div>
  );
}
