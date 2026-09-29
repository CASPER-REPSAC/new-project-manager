import { Router } from "express";
import sendQuery from "../feature/db.js";
const router = Router();
import { getRequireData } from "../feature/requirement.js";
import { getAuth } from "../feature/check.js";

router.get("/post/:idx", async (req, res) => {
    const data = await getRequireData(req.session);
    const user_auth = await getAuth(req.session.passport);
    const post_idx = req.params.idx;
    const user_info = {"is_post_owner" : 0};

    const post_row = await sendQuery(`SELECT * FROM post WHERE post_idx=?`, [post_idx]);

    if(post_row.length == 0){
        res.send("<script>alert('해당 글이 존재 하지 않습니다.'); location.href='/'; </script>");
        return;
    }

    if(data.is_login){
        const is_post_owner = await sendQuery(`SELECT count(post_idx) as cnt FROM post WHERE post_idx = ? AND user_id = ?`, [post_idx, req.session.passport.user.id]);
        user_info.is_post_owner = (is_post_owner[0].cnt == 1 ? 1 : 0);
    }
    
    const post_attach = await sendQuery(`SELECT path FROM post_attach WHERE post_idx = ?`, [post_idx]);
    const [comment, count] = await getCommentAndReply(post_idx);
    const side_posts = await getSidePosts(post_idx);
    const post_data = post_row[0];
    post_data.contents = JSON.parse(post_data.contents);

    res.render("post", {
        require: data, 
        post_data : post_data,
        post_attach : post_attach[0], 
        user_info : user_info,
        comment_data : comment,
        user_auth : user_auth,
        count : count,
        side_posts: side_posts
    });
})

const getCommentAndReply = async (post_idx) => {
    let post_comment = await sendQuery(`SELECT * FROM post_comment WHERE post_idx = ?`, [post_idx]);
    let user_list = [];
    let count = post_comment.length;

    // 각 댓글의 답글을 조회
    for(let i = 0; i < post_comment.length; i++){
        let reply_comment = await sendQuery(`SELECT * FROM comment_reply WHERE comment_idx = ?`, [post_comment[i].comment_idx]);
        count = count + reply_comment.length;
        post_comment[i].reply_comment = reply_comment;

        user_list.push(post_comment[i].user_id);

        for(let j=0; j<reply_comment.length; j++)
            user_list.push(reply_comment[j].user_id);
    }
    return [post_comment, count];
}

const getSidePosts = async (currnet_post_idx) => {
    const previous_post = await sendQuery(`SELECT post_idx FROM post WHERE post_idx < ? ORDER BY post_idx DESC LIMIT 0, 1`, [currnet_post_idx]);
    const next_post = await sendQuery(`SELECT post_idx FROM post WHERE post_idx > ? LIMIT 0, 1`, [currnet_post_idx]);

    return {
        "previous_post" : previous_post,
        "next_post" : next_post 
    }
}

export default router;