import { pdf_total_page } from "/js/uploadEvent.js";

$(document).on("click", "button.btn-section-add", (e) => {
    const section_field_count = getSectionFieldLength();
    const $parent_section_field = $(e.target.closest(".section-field"));
    
    removeBtn(e.target);
    addSectionField($parent_section_field, section_field_count);
})

$(document).on("click", "button.btn-section-remove", (e) => {
    const section_field_count = getSectionFieldLength();
    
    if(section_field_count == 1){
        alert('section 구역은 최소 1개는 있어야 합니다.');
        return;
    }

    const $parent_section_field = $(e.target.closest(".section-field"));
    removeSectionField($parent_section_field);
})

$(".btn-submit").click(() => {
    const data = getWriteData();
    
    if(data)
        sendToWrite(data);
})

// 프로젝트 유형 선택
$(document).on("click", ".select-type", (e) => {
    $(".select-type-value").val(e.target.value);
    $(".select-project-type").addClass("animate__animated animate__fadeOutDown");
    setTimeout(() => {
        $(".select-project-type").hide();
        $(".select-project-file").show();
        $(".select-project-file").addClass("animate__animated animate__fadeInDown");
    },1000);

})

// 썸네일 설정
$(document).on("click", ".pdf-to-image-canvas", (e) => {
    $(".pdf-to-image-canvas").removeClass("selected-thumbnail");
    $(e.target).addClass("selected-thumbnail");
})


export function getWriteData() {
    const data = {
        "title" : $("input[name=title]").val(),
        "date" : $("input[name=date]").val(),
        "subtitle" : $("input[name=subtitle]").val(),
        "total_page" : $("input[name=total_page]").val(),
        "section" : [],
        "section_opinion" : $("textarea[name=section_opinion]").val(),
        "type" : $(".select-type-value").val(),
        "tag" : $('#tags').val(),
        "thumbnail" : ""
    }
    const section_count = $(".section-field").length;
    
    if(data.title.length == 0) { alert("제목을 입력해 주세요"); return; }
    if(data.date.length == 0) { alert("날짜를 입력해 주세요"); return; }
    if($(".selected-thumbnail").length != 1) { alert("pdf 미리보기에서 썸네일 1개만 선택해 주세요."); return; }
    if(data.section_opinion.length == 0) { alert("의견을 입력해 주세요"); return; }
    if(data.tag.length == 0) { alert("태그를 입력해 주세요"); return; }
    if(!checkRange()){ alert("첨부한 파일의 페이지 보다 범위가 큽니다."); return;}

    for(let i=0; i<section_count; i++){
        data.section.push({
            "section_content" : $($(".section-field")[i]).find("textarea[name=section_content]").val(),
            "range_start" : $($(".section-field")[i]).find(".write-form-numbering").val(),
            "range_end" : $($(".section-field")[i]).find(".write-form-numbering2").val(),
        });

        if(data.section[i].section_content.length == 0){ alert("섹션 설명을 입력해 주세요"); return; }
        if(data.section[i].range_start.length == 0){ alert("시작 범위를 입력해 주세요"); return; }
        if(data.section[i].range_end.length == 0){ alert("끝 범위를 입력해 주세요"); return; }
    }

    data.thumbnail = canvasToImage();
    return data;
}

// 선택한 canvas를 이미지로 변환
function canvasToImage(){
    const canvas = document.getElementsByClassName("selected-thumbnail")[0];
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

function sendToWrite(data){
    fetch("/write", {
        method : "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        alert(res.message);
        if(res.result == "success")
            location.href = res.redirect;
    })
}

function checkRange(){
    for(let i=0; i<$(".write-form-numbering2").length; i++){
        if($(".write-form-numbering2")[i].value > pdf_total_page){
            return false;
        }
    }
    return true;
}

function getSectionFieldLength(){
    return $(".section-field").length;
}
function getCurrentSectionPage($section){
    return $section.find(".write-form-numbering2").val();
}

function getTotalSection(){
    return $("input[name='total_page']").val();
}

function addSectionField($secion_field, section_count){
    const current_section_page = getCurrentSectionPage($secion_field);
    const max_section = getTotalSection();
    let template = writeFormContentHTML(section_count+1, Number(current_section_page) + 1, max_section);

    $secion_field.after(template);
}

function removeSectionField($section_field){
    $section_field.remove();
    addBtn();
}


function removeBtn(target){
    const btn = target.closest(".col-sm-2").children;
    for(let i=0; i<2; i++){
        btn[0].remove();
    }
}
function addBtn(){
    const $selector = $($(".section-field")[$(".section-field").length-1].getElementsByClassName("col-sm-2"));
    const template = writeFormBtnsHTML();

    $selector.append(template);
}

function setTotalPage(page){
    $("input[name='total_page']").val(page);
    $(".write-form-numbering2").val(page);
    $(".write-form-numbering2").attr({"max" : page});
}