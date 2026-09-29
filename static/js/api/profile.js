const menu_list = {
    "Summary" : "summary",
    "All Projects" : "all_projects",
    "All Comments" : "all_comments",
    "Popular Projects" : "popular_projects"
}

$(document).ready(async () => {
    const user_id = $("input[name='user_id']").val();
    const result = await getData(user_id, menu_list[Object.keys(menu_list)[0]]);
    showData(Object.values(menu_list), menu_list[Object.keys(menu_list)[0]], result);
})

$(document).on("click", ".nav-link", async (e) => {
    $(".menu-result-project").children().remove();
    $(".menu-result-comment").children().remove()

    const user_id = $("input[name='user_id']").val();
    const selected_menu = $(e.target).text();

    const result = await getData(user_id, menu_list[selected_menu]);
    showData(Object.values(menu_list), menu_list[selected_menu], result);
})

const getData = async (user_id, menu) => {
    return await(
        fetch(`/profile/${user_id}`, {
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"option" : menu})
        })
        .then(res => res.json())
        .then(res => {
            return res
        })
    );
}

const showData = (menu_list, menu, data) =>{
    if(menu == menu_list[0]){
        for(let i=0; i<data.posts.length; i++){
            $(".menu-result-project").append(projectBoxHTML(data.posts[i]));
        }
        for(let i=0; i<data.comments.length; i++){
            $(".menu-result-comment").append(commentBoxHTML(data.comments[i]));
        }
    }
    else if(menu == menu_list[1]){
        for(let i=0; i<data.posts.length; i++){
            $(".menu-result-project").append(projectBoxHTML(data.posts[i]));
        }
    }
    else if(menu == menu_list[2]){
        for(let i=0; i<data.comments.length; i++){
            $(".menu-result-comment").append(commentBoxHTML(data.comments[i]));
        }
    }
    else if(menu == menu_list[3]){
        for(let i=0; i<data.posts.length; i++){
            $(".menu-result-project").append(projectBoxHTML(data.posts[i]));
        }
    }
}