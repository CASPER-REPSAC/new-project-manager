var _PDF_DOC,
        _CURRENT_PAGE,
        _TOTAL_PAGES,
        _CANVAS = document.querySelector('#pdf-canvas');


async function showPDF(pdf_url) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url }).promise;
    } catch (error) {
        alert(error.message);
    }

    _TOTAL_PAGES = _PDF_DOC.numPages;
    const section_count = $(".section-range").length;

    for (let sec = 0; sec < section_count; sec++) {
        let range = $(".section-range")[sec].value.split("~").map(Number);

        for (let s = range[0]; s <= range[1]; s++) {
            let sectionElement = $(".project-section-image")[sec];
            $(sectionElement).children().children().append(pdfToImgModalHTML(s, 400));

            let previewCanvas = document.querySelector(`#pdf-canvas-${s}`);
            showPage(s, previewCanvas);
        }
    }
}

// load and render specific page of the PDF
async function showPage(page_no, canvas) {
    if (page_no > _TOTAL_PAGES || page_no < 1) {
        console.error(`Page number out of range ${page_no}/${_TOTAL_PAGES}`);
        return;
    }

    try {
        let page = await _PDF_DOC.getPage(page_no);

        const outputScale = window.devicePixelRatio || 1;
        let viewport = page.getViewport({ scale: canvas.width / page.getViewport({ scale: 1 }).width * outputScale });

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        let render_context = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport,
            transform: [outputScale, 0, 0, outputScale, 0, 0]
        };

        await page.render(render_context);
    } catch (error) {
        console.log(error.message);
    }
}
        


async function getTotalPage(pdf_url){
    let pdf_info;

    try {
        pdf_info = await pdfjsLib.getDocument({ url: pdf_url }).promise;
    }
    catch(error) {
        console.log(error.message);
        return;
    }
    return pdf_info.numPages;
}