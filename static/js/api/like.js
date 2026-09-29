$(".fa-chevron-up").click(() => {
    const post_idx = $("input[name='post-idx']").val();
    like_unlike(`/api/like/${post_idx}`);
})

// $(".fa-chevron-down").click(() => {
//     const post_idx = $("input[name='post-idx']").val();
//     like_unlike(`/unlike/${post_idx}`);
// })

function like_unlike(url){
    fetch(url)
    .then(res => res.json())
    .then(res => {
        if(res.result == "success")
            $(".like-unlike-count").text(res.count);
        else if(res.result == "error")
            alert(res.message);
    })
}