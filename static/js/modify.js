import { initPDF } from '/js/previewPDF.js';
import { getWriteData } from '/js/write.js';

const init = async () => {
    const project_path = $("input[name=project_file]").val();
    await initPDF(project_path);
    $("input[name=total_page]").val(_TOTAL_PAGES);

    const section_data = JSON.parse($("input[name=section_data]").val());
    const opinion = $("input[name=my_opinion]").val();
    const tags = $("input[name=tags]").val().split(",");

    const datas = JSON.parse(section_data);

    // 섹션 개수 만큼 섹션 영역 추가
    for(let i=1; i<datas.length; i++){
        $(".btn-section-add").click();
    }

    // 섹션 데이터 입력
    for(let i=0; i<datas.length; i++){
        $($(".section-field")[i]).find("textarea[name=section_content]").val(datas[i].section_content);
        $($(".section-field")[i]).find(".write-form-numbering").val(datas[i].range_start);
        $($(".section-field")[i]).find(".write-form-numbering2").val(datas[i].range_end);
    }

    // 의견 데이터 입력
    $("textarea[name=section_opinion]").val(opinion);

    // 태그 데이터 입력
    for(let i=0; i<tags.length; i++){
        $("#tags").addTag(tags[i]);
    }
}

// 수정 버튼을 클릭 했을때
$(document).on("click", ".btn-modify-submit", () => {
    const data = getWriteData();
    console.log(data)
    console.log(data.section)
    
    if(data) {
        data.post_idx = $("input[name=post_idx]").val();
        sendModify(data);
    }
})

$(document).on("click", ".form-check-input", (e) => {
    $("input[name=project_type]").val(e.target.value);
})

const sendModify = (data) => {
    fetch("/modify", {
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

init();