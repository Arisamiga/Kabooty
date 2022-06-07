import type { RequestHandler } from '@sveltejs/kit';
import OAuth from 'discord-oauth2';
import { Env } from '../../../env';
import cookie from 'cookie';
import { dev } from '$app/env';
import { Jwt } from '../../../jwt';

export interface IDiscordAccessToken extends Record<string, string | number> {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export const get: RequestHandler = async ({ request }) => {
	if (request.headers.has('cookie')) {
		const cookieHeader = request.headers.get('cookie');

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const cookies = cookie.parse(cookieHeader!);

		if (cookies["discord_token"]) {
			return {
				status: 200
			};
		}
	}

	const env = Env.load();

	const client = new OAuth({
		clientId: env['DISCORD_CLIENT_ID'],
		clientSecret: env['DISCORD_CLIENT_SECRET']
	});

	const code = request.headers.get('Authorization');

	if (!code || code.length === 0) {
		return {
			status: 400,
			body: {
				error: 'Missing Discord code'
			}
		};
	}

	try {
		const token = await client.tokenRequest({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			code: code!,
			grantType: 'authorization_code',
			redirectUri: env['DISCORD_REDIRECT_URI'],
			clientId: env['DISCORD_CLIENT_ID'],
			clientSecret: env['DISCORD_CLIENT_SECRET'],
			scope: ['identify', 'guilds', 'guilds.join']
		});

		const user = await client.getUser(token.access_token);

		const setCookie = cookie.serialize(
			'discord_token',
			Jwt.encode({ access_token: token.access_token }),
			{
				expires: new Date(Date.now() + (token.expires_in - 5000) * 1000),
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev
			}
		);

		const userCookie = cookie.serialize(
			'user_id',
			Jwt.encode({ user_id: user.id }),
			{
				expires: new Date(Date.now() + (token.expires_in - 5000) * 1000),
				httpOnly: true,
				sameSite: 'none',
				secure: !dev
			}
		);

		const response = new Response();

		response.headers.append('Set-Cookie', setCookie);
		response.headers.append('Set-Cookie', userCookie);

		return response;
	} catch (error) {
		return {
			status: 400,
			body: {
				error: 'Failed to authenticate with Discord'
			}
		};
	}
};
