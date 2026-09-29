$(".feed").click(function (){
    if($(this).attr("class").indexOf("active") == -1 && confirm("새 게시글이 등록되면 Gmail로 알림을 받으시겠습니까?")){
        send(1)
        .then(res => {
            if(res == true){
                $(this).addClass("active");
                $(this).html(`<i class="fas fa-rss-square fa-lg"></i>`);
            }
        })
    }
    else if($(this).attr("class").indexOf("active") != -1 && confirm("새 게시글 알림을 받지 않겠습니까?")){
        send(0)
        .then(res => {
            if(res == true){
                $(this).removeClass("active");
                $(this).html(`<i class="fas fa-rss-square fa-lg"></i>`);
            }
        })
    }
})

function send(feed){
    return new Promise((resolve, reject) => {
        fetch(`/feed?feed=${feed}`)
        .then(res => res.json())
        .then(res => {
            if(res.result == "error"){
                alert(res.message);
                resolve(false);
            }
            resolve(true);
        })
    })
}