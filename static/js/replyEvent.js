$(document).on("click", ".comment-reply", (e) => {
    const $target = $(e.target);

    if($target.closest(".col-sm-11").find(".input-reply-content").length){
        return;
    }
    const comment_idx = $target.find("input[name='comment-idx']").val();
    $target.closest(".col-sm-11").append(replyInputFormHTML(comment_idx));
})

$(document).on("click", ".btn-reply", (e) => {
    const $target = $(e.target);
    const comment_idx = $target.val();
    const reply_content = $target.closest(".input-reply-box").find(".input-reply-content").val();
    const post_idx = $("input[name='post-idx']").val();

    if(comment_idx.length == 0 || reply_content.length == 0) { alert("답글 내용을 입력해 주세요."); return; }

    writeReply(comment_idx, reply_content, post_idx);
})

function writeReply(comment_idx, reply_content, post_idx){
    fetch("/api/reply", {
        method : "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "comment_idx" : comment_idx,
            "reply_content" : reply_content,
            "post_idx" : post_idx
        })
    })
    .then(res => res.json())
    .then(res => {
        alert(res.message);
        if(res.result == "success") location.reload();
    })
}