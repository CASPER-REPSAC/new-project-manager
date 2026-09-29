// previewPDF.js
export const initPDF = async (path) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: path }).promise;
    } catch (error) {
        alert(error.message);
    }

    _TOTAL_PAGES = _PDF_DOC.numPages;

    for (let i = 1; i <= _TOTAL_PAGES; i++) {
        $(".pdf-preview").append(pdfPreviewHTML(225, i));

        let previewCanvas = document.querySelector(`#pdf-canvas-${i}`);
        showPage(i, previewCanvas);
    }

    setTimeout(() => {
        document.querySelector(`#pdf-canvas-1`).style.display = "";
    }, 1000);
};
