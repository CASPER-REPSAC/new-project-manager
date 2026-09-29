$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

const changeModal = (modal_number) => {
    $(".modal").modal("hide"); // 현재 모달 닫기
    $("#pdfModal-" + modal_number).modal("show"); // 새로운 모달 열기
};

// 모달이 열릴 때 PDF 크기 조정
$(document).on('shown.bs.modal', '[id^="pdfModal-"]', function () {
    let modal_number = $(this).attr('id').split('-')[1]; // "pdfModal-숫자"에서 숫자 부분 추출
    let canvas = document.querySelector(`#pdf-canvas-modal-${modal_number}`);

    if (canvas) {
        let modalDialog = $(this).find('.modal-dialog');
        let modalBody = $(this).find('.modal-body'); // 모달 내부 높이 가져오기
        let modalWidth = modalBody.width() * 0.5; // 모달 가로 길이 가져오기
        let maxHeight = window.innerHeight * 0.8; // 최대 높이 (화면 높이의 80%)

        canvas.width = modalWidth; // 모달 가로 길이에 맞춤
        canvas.style.width = "100%"; // 가로 크기를 모달 크기에 맞춤
        canvas.style.objectFit = "contain"; // PDF 비율 유지
        canvas.style.overflowY = "auto"; // 세로 스크롤 가능하도록 설정

        showPage(Number(modal_number), canvas);
    }
});

