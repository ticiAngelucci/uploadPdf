import React, { useState, useRef, useEffect } from "react"; // 1. Importamos useRef y useEffect
import PDFViewer from "./PDFViewer";
import './index.css';
import { InputBase, Button } from "@mui/material"; // Importamos Button de MUI
import SignaturePad from 'signature_pad'; // 2. Importamos la librería SignaturePad

export default function PDFUploadForm() {
    const [fileUrl, setFileUrl] = useState(null);
    const [name, setName] = useState(""); // Estado para el InputBase

    // --- Lógica de SignaturePad ---
    const canvasRef = useRef(null);
    const signaturePadRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;

            // Ajuste de resolución para evitar pixelación en pantallas de alta densidad
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = 200 * ratio; // 200px de altura visual
            canvas.getContext("2d").scale(ratio, ratio);

            // Inicialización de SignaturePad
            const signaturePad = new SignaturePad(canvas, {
                backgroundColor: 'rgb(255, 255, 255)',
                penColor: 'rgb(0, 0, 0)',
                onEnd: () => setIsEmpty(signaturePadRef.current.isEmpty()),
            });

            signaturePadRef.current = signaturePad;
        }

        // Limpieza al desmontar
        return () => {
            if (signaturePadRef.current) {
                signaturePadRef.current.off();
            }
        };
    }, []);

    const handleClearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
            setIsEmpty(true);
        }
    };

    const handleSaveSignature = () => {
        if (signaturePadRef.current && !isEmpty) {
            const dataURL = signaturePadRef.current.toDataURL("image/png");
            console.log('Firma Base64 para guardar:', dataURL);
            // Implementa aquí la lógica para enviar 'dataURL' a tu backend
            alert("Firma guardada (revisa la consola para ver los datos Base64).");
        } else {
            alert('Por favor, dibuja una firma antes de guardar.');
        }
    };
    // -----------------------------

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    };

    const TEXT_FIELD_ID = "document-name-input";
    const customInputStyles = {
        backgroundColor: "white",
        fontSize: "12px",
        fontFamily: "robotoMedium",
        height: "30px",
        color: "black",
        borderRadius: 0,
        border: "1px solid #ccc",
        padding: '0 8px',
        "&:hover": { backgroundColor: "white", borderColor: "#316094" }
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Sección de Subida de Documento */}


            {/* Sección de Firma (Canvas) */}
            <div style={{ margin: '30px 0', border: '1px solid #ddd', padding: '10px' }}>
                <h2>Área de Firma</h2>

                {/* Canvas de Firma */}
                <canvas
                    className="signature-canvas"
                    ref={canvasRef}
                    height={1000}
                    style={{
                        border: '1px solid black',
                        width: '100%',
                        height: '1000px',
                        touchAction: 'none'
                    }}
                    role="application"
                    aria-label="Área de firma. Toque dos veces y mantenga para firmar con el dedo."
                    aria-describedby="signature-instructions"
                    tabIndex="0"
                />


                {/* Botones de control de firma */}
                <div style={{ marginTop: '10px' }}>
                    <Button
                        onClick={handleClearSignature}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ marginRight: '10px' }}
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

                {/* Instrucciones ARIA (Ocultas visualmente) */}
                <div
                    id="signature-instructions"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                >
                    Para firmar, use su dedo o lápiz óptico para dibujar la firma en el área blanca.
                </div>
            </div>

            {/* Visor de PDF */}
            {fileUrl && <PDFViewer fileUrl={fileUrl} />}
        </div>
    );
}