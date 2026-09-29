import { Router } from "express";
const router = Router();

import { isLogin } from "../../feature/check.js";
import sendQuery from "../../feature/db.js";

router.get("/api/like/:idx", async (req, res) => {
    if(!isLogin(req.session.passport)){
        res.json({"result" : "error", "message" : "로그인을 해주세요."});
        return;
    }
    const user_id = req.session.passport.user.id;
    const post_idx = req.params.idx;

    const row = await sendQuery(`SELECT like_idx FROM post_like WHERE user_id = ? and post_idx = ?`, [user_id, post_idx]);
    if(row.length != 0){
        res.json({"result" : "error", "message" : "이미 좋아요를 한 상태 입니다."});
        return;
    }

    const like_count_row = await sendQuery(`SELECT like_count FROM post WHERE post_idx = ?`, [post_idx]);
    const update_like_count = Number(like_count_row[0].like_count) + 1;
    
    await sendQuery(`INSERT INTO post_like (user_id, post_idx) VALUES (?,?)`, [user_id, post_idx]);
    await sendQuery(`UPDATE post SET like_count = ? WHERE post_idx = ?`, [update_like_count, post_idx]);

    res.json({"result" : "success", "count" : update_like_count});
})

export default router;
