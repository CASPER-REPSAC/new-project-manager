import { Router } from "express";
const router = Router();
import passport from 'passport';
import sendQuery from "../feature/db.js";
import OpenIDConnectStrategy from "passport-openidconnect";
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
const { AUTHENTIK_ISSUER, AUTHENTIK_CLIENT_ID, AUTHENTIK_CLIENT_SECRET, AUTHENTIK_CALLBACK_URL } = process.env;
const configured = [AUTHENTIK_ISSUER, AUTHENTIK_CLIENT_ID, AUTHENTIK_CLIENT_SECRET, AUTHENTIK_CALLBACK_URL].every(Boolean);

if (configured) {
    const origin = new URL(AUTHENTIK_ISSUER).origin;
    passport.use(new OpenIDConnectStrategy({
        issuer: AUTHENTIK_ISSUER,
        authorizationURL: `${origin}/application/o/authorize/`,
        tokenURL: `${origin}/application/o/token/`,
        userInfoURL: `${origin}/application/o/userinfo/`,
        clientID: AUTHENTIK_CLIENT_ID,
        clientSecret: AUTHENTIK_CLIENT_SECRET,
        callbackURL: AUTHENTIK_CALLBACK_URL,
        scope: ['profile', 'email'],
        skipUserProfile: false
    }, async (issuer, profile, done) => {
        if (!profile?.id || profile.id.length > 64 || !profile.emails?.[0]?.value) return done(null, false);
        const user_id = profile.id;
        const user_name = (profile.displayName || profile.emails[0].value).slice(0, 50);
        const user_email = profile.emails[0].value;
        try {
            const rows = await sendQuery(`SELECT user_id FROM user WHERE user_id = ?`, [user_id]);
            if (!rows) return done(new Error('Database unavailable'));
            const result = rows.length === 0
                ? await sendQuery(`INSERT INTO user (user_id, user_email, user_name, auth, registration_date) VALUES (?, ?, ?, "guest", sysdate())`, [user_id, user_email, user_name])
                : await sendQuery(`UPDATE user SET user_name = ?, user_email = ? WHERE user_id = ?`, [user_name, user_email, user_id]);
            if (!result) return done(new Error('Database unavailable'));
            done(null, { id: user_id });
        } catch (err) {
            done(err);
        }
    }));
}

router.get('/login', configured ? passport.authenticate('openidconnect') : (req, res) => res.status(503).send('SSO is not configured'));
router.get('/auth/oidc/callback', configured ? passport.authenticate('openidconnect', { failureRedirect: '/' }) : (req, res) => res.status(503).send('SSO is not configured'), (req, res) => res.redirect('/'));
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => err ? next(err) : res.redirect('/'));
    });
});
export default router;
