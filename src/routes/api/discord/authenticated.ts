import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';
import { DiscordBot } from '../../../bot/discord';
import { SentryClient } from '../../../bot/sentry';
import { Jwt } from '../../../jwt';

export const get: RequestHandler = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');
	const cookies = cookie.parse(cookieHeader ?? '');

	// !! initialize discord bot every time a user checks if they're authenticated
	// !! this is a temporary solution until the discord bot is a separate codebase
	DiscordBot.client;

	let token: string;

	try {
		const decoded = Jwt.decode(cookies['discord_token']);
		token = decoded['access_token'] as string;
	} catch (error) {
		SentryClient.log(error);

		return {
			body: {
				authenticated: false
			}
		};
	}

	if (!token) {
		return {
			body: {
				authenticated: false
			}
		};
	} else {
		return {
			body: {
				authenticated: true
			}
		};
	}
};
