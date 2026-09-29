$(".btn-comment").click(() => {
    const comment_content = $(".input-comment-content").val();
    const post_idx = $("input[name='post-idx']").val();

    if(comment_content.length == 0) { alert('댓글 내용을 입력 해주세요.'); return; }

    writeComment(post_idx, comment_content);
})

function writeComment(post_idx, comment_content){
    fetch("/api/comment", {
        method : "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            "post_idx" : post_idx,
            "comment_content" : comment_content
        })
    })
    .then(res => res.json())
    .then(res => {
        alert(res.message);
        if(res.result == "success") location.href = res.redirect;
    })
}