import { Router } from "express";
const router = Router();
import sendQuery from "../../feature/db.js";

router.get("/api/index", async (req, res) => {
    const max_content_cnt = 10;
    const idx = Number(req.query.idx) ? max_content_cnt * (Number(req.query.idx) - 1): 1;

    const mode = req.query.mode === "popular" ? "popular" : "recent";
    const writer = typeof req.query.writer === "string" ? req.query.writer.trim() : "";

    let where = "WHERE 1=1";
    const values = [];

    if (writer) {
        where += " AND writer LIKE ?";
        values.push(`%${writer}%`);
    }

    let orderBy = "post_idx DESC";
    if (mode === "popular") {
        const range = req.query.range === "year" ? "1 YEAR" : "1 MONTH";
        where += ` AND like_count >= 1 AND post_date >= DATE_SUB(NOW(), INTERVAL ${range})`;
        orderBy = "like_count DESC, post_idx DESC";
    }

    const posts_row = await sendQuery(
        `SELECT user_id, post_idx, writer, title, post_date, type, tag, thumbnail, like_count FROM post ${where} ORDER BY ${orderBy} LIMIT ${idx}, ${max_content_cnt}`,
        values
    );
    const promises = posts_row.map(async (row, idx) => {
        if (row["title"].length > "30")
            posts_row[idx]["title"] = row["title"].substr(0,30) + "...";

        return posts_row[idx];
    })
    const result = await Promise.all(promises);

    res.json(result);
})

router.get("/api/writers", async (req, res) => {
    const rows = await sendQuery(`SELECT DISTINCT writer FROM post ORDER BY writer ASC`, []);
    res.json(rows.map((row) => row.writer));
})

export default router;
