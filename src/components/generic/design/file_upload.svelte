<script lang="ts">
	import SolidButton from './solid_button.svelte';

	let fileinput: HTMLInputElement;

	export let width = 0;
	export let height = 0;
	export let maxBytes = 0;

	export let onDataUrl: (dataUrl: string | null) => void;
	export let onBuffer: (buffer: ArrayBuffer, filename: string) => void;

	const onFileSelected = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		let image: File | null = null;

		if (e.currentTarget && e.currentTarget['files'] && e.currentTarget['files'].length > 0) {
			image = e.currentTarget['files'][0];
		}

		if (!image || image === null) {
			return;
		}

		if (image.size > maxBytes) {
			alert('File is too large');
			return;
		}

		if (
			image.type !== 'image/png' &&
			image.type !== 'image/jpeg' &&
			image.type !== 'image/jpg' &&
			image.type !== 'image/webp'
		) {
			alert('Only PNG, WebP, and JPEG files are supported');
			return;
		}

		const buffer = new FileReader();
		buffer.readAsArrayBuffer(image);

		buffer.onload = (e) => {
			const result = e.target?.result as ArrayBuffer;
			const filename = image?.name;

			if (result && filename) {
				onBuffer(result, filename);
			}
		};

		const dataUrl = new FileReader();
		dataUrl.readAsDataURL(image);

		dataUrl.onload = (e) => {
			const result = e.target?.result as string;

			const img = new Image();
			img.src = result;

			img.onload = () => {
				if (img.width < width || img.height < height) {
					// TODO: make alerts look nice
					onDataUrl(null);
					alert('Image is too small');
					return;
				}

				if (result) {
					onDataUrl(result);
				}
			};
		};
	};

	export let string = 'file.upload';
</script>

<input
	type="file"
	accept=".png, .jpeg, .jpg, .webp"
	on:change={(e) => onFileSelected(e)}
	bind:this={fileinput}
	style="display: none;"
/>
<SolidButton click={async () => fileinput.click()} color="green" {string} />
