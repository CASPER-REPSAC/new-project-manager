import { getUserTheme, isLogin, getFeed } from "../feature/check.js";

export async function getRequireData(session) {
    const [user_theme, check] = getUserTheme(session.user_theme)
    const is_login = await isLogin(session.passport);
    const feed = await getFeed(session.passport);

    return {
        "web_theme" : user_theme,
        "check" : check,
        "is_login" : is_login,
        "feed" : feed
    };
}

export default getRequireData;