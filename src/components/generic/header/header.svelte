<script lang="ts">
	import HeaderButton from '../design/header_button.svelte';
	import SignInButton from '../design/signin_button.svelte';
	import Sidebar from '../sidebar/sidebar.svelte';
	import type { IFuctions } from '../sidebar/functions';

	import links from './links.json';

	let sidebar: IFuctions;
</script>

<div id="header">
	<Sidebar bind:functions={sidebar} />
	<div id="navigation">
		<div id="decoration">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img id="dec1" src="/assets/28.png" />
			<!-- svelte-ignore a11y-missing-attribute -->
			<img id="dec2" src="/assets/30.png" />
		</div>
		<i id="icon" class="las la-bars" on:click={() => sidebar.toggle()} />

		<a href="/"><img src="/logo.png" alt="Home" /></a>

		<div style="display: flex;">
			<div id="links">
				{#each links as link}
					<div>
						<HeaderButton route={link['route']} string={link['string']} />
					</div>
				{/each}
			</div>

			<SignInButton />
		</div>
	</div>
</div>

<style lang="scss">
	#header {
		background: $decoration-fill;
		background: linear-gradient(90deg, $gradient-dark 0%, $gradient-light 100%);
		box-shadow: $box-shadow;

		width: 100%;
		height: $header-height;
		display: flex;
		justify-content: center;

		#navigation {
			max-width: $max-width;
			width: 100%;
			height: $header-height;
			display: flex;
			align-items: center;
			justify-content: space-between;

			position: relative;

			#decoration {
				position: absolute;
				height: $header-height;
				width: 100%;
				overflow: hidden;
				max-width: $max-width;

				top: 0;

				display: flex;
				justify-content: space-between;

				pointer-events: none;

				img {
					margin: 0;
				}

				img#dec1 {
					position: relative;
					top: -30px;
					left: -10px;
					width: 120px;
					height: 120px;
				}

				img#dec2 {
					position: relative;
					top: -30px;
					right: 30px;
					width: 120px;
					height: 120px;
				}
			}

			#icon {
				width: $header-height;
				height: $header-height;
				line-height: $header-height;

				text-align: center;

				font-size: $icon-size;

				color: white;

				display: block;

				@media (min-width: $breakpoint-m) {
					display: none;
				}
			}

			img {
				height: 33px;
				margin-left: 0;

				@media (min-width: $breakpoint-m) {
					margin-left: $margin-m - $margin-xs;
				}
			}

			#links {
				min-width: $header-height;

				margin-right: 0;

				display: none;

				@media (min-width: $breakpoint-m) {
					margin-right: $margin-m;
					display: flex;
				}

				div {
					display: none;

					@media (min-width: $breakpoint-m) {
						display: block;
					}
				}
			}
		}
	}
</style>
