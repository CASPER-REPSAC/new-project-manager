import { initPDF } from '/js/previewPDF.js';

export let pdf_total_page;

$("input[type='file']").on("change", () => {
    const file = $("input[type='file']")[0].files[0];
    const file_ext = getFileExt(file.name);

    if(!fileExtCheck(file_ext)){
        alert("pdf 파일만 허용 됩니다.");
        return;
    }

    const upload_file = new FormData();
    
    upload_file.append("file", file);
    sendFileToServer(upload_file);
})

function getFileExt(file){
    return file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
}

function fileExtCheck(file_ext){
    if(file_ext != "pdf")
        return false;
    return true;
}

function sendFileToServer(upload_file){
    fetch("/api/upload", {
        method : "POST",
        body : upload_file
    })
    .then(res => res.json())
    .then(async (res) => {
        alert(res.message);
        $(".select-project-file").addClass("animate__animated animate__fadeOutDown");
        setTimeout(() => {
            $(".select-project-file").hide();
            
            $(".input-detail").show();
            $(".input-detail").addClass("animate__animated animate__fadeIn");

            initPDF(res.path);
        },1000);
    })
}