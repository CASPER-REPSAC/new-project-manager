import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

process.env.AUTHENTIK_ISSUER = 'https://auth.example.test/application/o/project-manager/';
process.env.AUTHENTIK_CLIENT_ID = 'test-client';
process.env.AUTHENTIK_CLIENT_SECRET = 'test-secret';
process.env.AUTHENTIK_CALLBACK_URL = 'http://localhost:3050/auth/oidc/callback';
const { default: login } = await import('../router/login.js');

test('login redirects to Authentik with OIDC state and callback', async () => {
    const app = express();
    app.use(session({ secret: 'test-session-secret', resave: false, saveUninitialized: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(login);
    const server = app.listen(0);
    try {
        const response = await fetch(`http://localhost:${server.address().port}/login`, { redirect: 'manual' });
        const target = new URL(response.headers.get('location'));
        assert.equal(response.status, 302);
        assert.equal(target.origin + target.pathname, 'https://auth.example.test/application/o/authorize/');
        assert.equal(target.searchParams.get('client_id'), 'test-client');
        assert.equal(target.searchParams.get('redirect_uri'), process.env.AUTHENTIK_CALLBACK_URL);
        assert.equal(target.searchParams.get('scope'), 'openid profile email');
        assert.ok(target.searchParams.get('state'));
        assert.ok(response.headers.get('set-cookie'));
        const invalidCallback = await fetch(`http://localhost:${server.address().port}/auth/oidc/callback?code=fake&state=wrong`, {
            redirect: 'manual',
            headers: { cookie: response.headers.get('set-cookie') }
        });
        assert.equal(invalidCallback.status, 302);
        assert.equal(invalidCallback.headers.get('location'), '/');
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
});
