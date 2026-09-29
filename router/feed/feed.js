import { Router } from "express";
const router = Router();

import sendQuery from "../../feature/db.js";
import { isLogin } from "../../feature/check.js";

router.get("/feed", async (req, res) => {
    const option = Number(req.query.feed) ? Number(req.query.feed) : 0;

    if(!isLogin(req.session.passport)){
        res.json({"result" : "error", "message" : "로그인을 해주세요."});
        return;
    }

    const user_id = req.session.passport.user.id;
    await sendQuery(`UPDATE user SET feed = ? WHERE user_id = ?`, [option, user_id]);

    res.json({"result" : "success"});
})

export default router;