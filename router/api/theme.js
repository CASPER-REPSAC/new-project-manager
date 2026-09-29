import { Router } from "express";
const router = Router();

router.get("/api/theme", (req, res) => {
    const data = (req.query.data == "dark" ? "dark" : "light");
    req.session.user_theme = data;

    res.json({"result" : "success"});
})

export default router;