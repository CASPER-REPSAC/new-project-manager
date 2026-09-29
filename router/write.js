import { Router } from "express";
const router = Router();

import sendQuery from "../feature/db.js";
import { checkAuth, getAuth, isLogin } from "../feature/check.js";
import { getRequireData } from "../feature/requirement.js";
import { start } from "./feed/mailer.js";

router.get("/write", async (req, res) => {
    const data = await getRequireData(req.session);
    if(!(await checkAuth(req, res, data))) return;

    const user_auth = await getAuth(req.session.passport);
    let feed = '';

    if(isLogin(req.session.passport)){
        feed = (await sendQuery(`SELECT feed FROM user WHERE user_id = ?`, [req.session.passport.user.id]))[0].feed;
    }

    res.render("write", {
        require : data, 
        user_auth : user_auth,
        feed : feed
    });
})

router.post("/write", async (req, res) => {
    const data = await getRequireData(req.session);
    if(!(await checkAuth(req, res, data))) return;

    const input = req.body;
    
    if(input.title.length == 0) { res.json({"result" : "error", "message" : "제목을 입력해 주세요."}); return; }
    if(input.date.length == 0) { res.json({"result" : "error", "message" : "날짜를 입력해 주세요"}); return; }
    if(input.section_opinion.length == 0) { res.json({"result" : "error", "message" : "의견을 입력해 주세요"}); return; }
    if(input.tag.length == 0) { res.json({"result" : "error", "message" : "태그를 입력해 주세요"}); return; }

    for(let i=0; i<input.section.length; i++){
        if(input.section[i].section_content.length == 0){ res.json({"result" : "error", "message" : "섹션 설명을 입력해 주세요."}); return; }
        if(input.section[i].range_start.length == 0){ res.json({"result" : "error", "message" : "시작 범위를 입력해 주세요."}); return; }
        if(input.section[i].range_end.length == 0){ res.json({"result" : "error", "message" : "끝 범위를 입력해 주세요."}); return; }
        if(!parseInt(input.section[i].range_start) || !parseInt(input.section[i].range_end)){ res.json({"result" : "error", "message" : "범위는 숫자만 입력해 주세요."}); return; }
        if(parseInt(input.section[i].range_start) <=0 || parseInt(input.section[i].range_end) <= 0) {res.json({"result" : "error", "message" : "지정한 범위는 0 보다 커야 합니다."}); return;}
        if(parseInt(input.section[i].range_start) > parseInt(input.section[i].range_end)){res.json({"result" : "error", "message" : "시작 범위가 끝 범위보다 클 수 없습니다."}); return; }
        if(i != 0 && parseInt(input.section[i].range_start) <= parseInt(input.section[i-1].range_end)){res.json({"result" : "error", "message" : "다음 섹션의 '시작 범위'가 이전 색션의 '끝 범위'보다 커야 합니다."}); return; }
    }

    const user_id = req.session.passport.user.id;

    const tmp_path_row = await sendQuery(`SELECT tmp_path FROM tmp_post_attach WHERE user_id = ? ORDER BY tmp_attach_idx DESC`, [user_id]);
    const writer = (await sendQuery(`SELECT user_name FROM user WHERE user_id = ?`, [user_id]))[0].user_name;
    await sendQuery(`DELETE FROM tmp_post_attach WHERE user_id = ?`, [user_id]);
    await sendQuery(`INSERT INTO post (user_id, writer, title, subtitle, contents, opinion, post_date, project_date, type, tag, thumbnail) VALUES (?, ?, ?, ?, ?, ?, now(), ?, ?, ?, ?)`,
                                       [user_id, writer, input.title, input.subtitle, JSON.stringify(input.section), input.section_opinion, input.date, input.type, input.tag, input.thumbnail]);

    const row = await sendQuery(`SELECT post_idx FROM post WHERE user_id = ? ORDER BY post_idx DESC LIMIT 0,1`, [user_id]);
    await sendQuery(`INSERT INTO post_attach (post_idx, path) VALUES (?, ?)`, [row[0].post_idx, tmp_path_row[0].tmp_path]);
    const feed_user_list_row = await sendQuery(`SELECT user_email FROM user WHERE feed = 1`);
    feed_user_list_row.map(async (list) => {
        const user_email = list.user_email;
        const title = `[Casper Project Manager] New Project!!`;
        const content = `<a href='${req.hostname}'><img src='${req.hostname}/image/email2.png'></a><br><Br>Project Manager 에서 새로운 프로젝트가 업로드 되었어요.<br><Br><Br>
                            title: ${input.title}<br>
                            PDF download: <a href='${req.hostname}${tmp_path_row[0].tmp_path}'>${tmp_path_row[0].tmp_path}</a><Br><br>
                            <a href='${req.hostname}/post/${row[0].post_idx}'>프로젝트 염탐하러 가기.</a><br><Br>
                            더 이상 메일을 받지 않으려면, <a href='${req.hostname}'>Project Manager</a>에 방문해서 로그인 후 Feed를 꺼주시기 바랍니다.`;
        await start(user_email, content, title);
    })

    res.json({"result" : "success", "message" : "글이 작성 되었습니다.", "redirect" : `/post/${row[0].post_idx}`})
})


export default router;
