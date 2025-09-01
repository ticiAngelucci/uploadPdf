import React, { useState } from "react";
import PDFViewer from "./PDFViewer";

export default function PDFUploadForm() {
    const [fileUrl, setFileUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
        }
    };

    return (
        <div>
            <h1>Subir PDF</h1>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                aria-label="Seleccionar archivo PDF"
            />
            {fileUrl && <PDFViewer fileUrl={fileUrl} />}
        </div>
    );
}
