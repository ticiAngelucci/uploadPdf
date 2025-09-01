import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js';

async function extractText(fileUrl) {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n\n';
    }
    return text;
}

export default function PDFViewer({ fileUrl }) {
    const [accessibleText, setAccessibleText] = useState('');

    useEffect(() => {
        extractText(fileUrl).then(setAccessibleText);
    }, [fileUrl]);

    return (
        <div role="region" aria-label="Visor de documento PDF" style={{ border: '1px solid rgba(0,0,0,0.3)', height: '750px', overflow: 'auto' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} />
            </Worker>
            <div aria-live="polite" tabIndex={0} style={{ marginTop: '1rem' }}>
                <h2>Versión accesible del contenido</h2>
                <p>{accessibleText || "El contenido accesible no está disponible."}</p>
            </div>
        </div>
    );
}
