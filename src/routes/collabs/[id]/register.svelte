<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';

	import { discord } from '../../../stores/discord';
	import { osu } from '../../../stores/osu';

	import axios from 'axios';
	import type { AnimeCharacter, Collab } from '@prisma/client';
	import LoadingSpinner from '../../../components/generic/design/loading_spinner.svelte';
	import Info from '../../../components/collabs/register/info.svelte';
	import Discord from '../../../components/collabs/register/discord.svelte';
	import Osu from '../../../components/collabs/register/osu.svelte';
	import Rules from '../../../components/collabs/register/rules.svelte';
	import Character from '../../../components/collabs/register/character.svelte';
	import { selected } from '../../../components/collabs/register/character/selected_store';
	import Image from '../../../components/collabs/register/image.svelte';
	import Extra from '../../../components/collabs/register/extra.svelte';

	let collab: Collab | null = null;

	let rulesAgreed = false;

	let character: AnimeCharacter | undefined | null = null;
	let imageBuffer: ArrayBuffer | null = null;
	let filename: string | null = null;

	onMount(async () => {
		const collabId = $page.params['id'];

		collab = (await axios.get('/api/collabs/' + collabId)).data;
	});
</script>

{#if collab}
	<div id="column">
		<div id="content">
			<Info {collab} />
			{#if !$discord}
				<Discord />
			{:else if !$osu}
				<Osu />
			{:else if collab.rules && !rulesAgreed}
				<Rules
					{collab}
					accept={async () => {
						rulesAgreed = true;
					}}
				/>
			{:else if !character}
				<Character
					{collab}
					submit={async (_, name) => {
						character = _;

						if (character?.id === -1 && name) {
							character.name = name;
						}

						selected.update(null);
					}}
				/>
			{:else if !imageBuffer || !filename}
				<Image
					submit={async (buffer, name) => {
						imageBuffer = buffer;
						filename = name;
					}}
				/>
			{:else}
				<Extra {collab} {imageBuffer} {filename} {character} />
			{/if}
		</div>
	</div>
{:else}
	<LoadingSpinner />
{/if}

<style lang="scss">
	#column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;

		#content {
			width: 100%;
			max-width: $max-width + $margin-s * 2;

			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
		}
	}
</style>
