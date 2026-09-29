import { Router } from "express";
const router = Router();
import { getRequireData } from "../feature/requirement.js";
import { getAuth } from "../feature/check.js";
import sendQuery from "../feature/db.js";

router.get("/", async (req, res) => {
    const data = await getRequireData(req.session);
    const user_auth = await getAuth(req.session.passport);
    const comment_info = await getRecentCommentAndReply();

    res.render("index", {
        require : data,
        user_auth : user_auth,
        comment : comment_info
    });
})

const getRecentCommentAndReply = async () => {
    // 최근 3개월 이내에 등록된 댓글과 답글을 가져와서, 그 중에 최근에 등록된 10개만 가져옴.
    const tmp_user = {};
    const result = await sendQuery(`SELECT *
                                        FROM   (SELECT "comment" AS "type",
                                                        comment_idx,
                                                        post_idx,
                                                        user_id,
                                                        writer,
                                                        comment_date,
                                                        comment_content
                                                FROM   post_comment
                                                WHERE  comment_date >= Date_add(Now(), INTERVAL -3 month)
                                                UNION
                                                SELECT "reply" AS "type",
                                                        reply_idx,
                                                        post_idx,
                                                        user_id,
                                                        writer,
                                                        reply_date,
                                                        reply_content
                                                FROM   comment_reply
                                                WHERE  reply_date >= Date_add(Now(), INTERVAL -3 month)) AS result
                                        ORDER  BY comment_date DESC
                                        LIMIT  0, 10`);
    
    for(const [i, data] of result.entries()){
        // 최대 글자수
        if(data.comment_content.length >= 70){
            result[i].comment_content = data.comment_content.substr(0, 70) + "...";
        }
    }
    return result;
}

export default router;