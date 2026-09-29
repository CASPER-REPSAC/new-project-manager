$(".btn-delete-post").click(() => {
    if(confirm("해당 게시글을 삭제 하겠습니까?")){
        const post_idx = $("input[name='post-idx']").val();
        deleteData(`/api/post/${post_idx}`);
    }
})

function deleteData(url){
    fetch(url, {
        method : "delete"
    })
    .then(res => res.json())
    .then(res => {
        alert(res.message);
        if(res.result == "success") location.href = res.redirect;
    })
}