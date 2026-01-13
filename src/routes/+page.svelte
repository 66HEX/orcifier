<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { FaceLandmarkerService } from '$lib/runes/faceLandmarker.svelte';
	import StatusOverlay from '$lib/components/StatusOverlay.svelte';
	import Webcam from '$lib/components/Webcam.svelte';
	import Scene from '$lib/components/Scene.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';

	const faceService = new FaceLandmarkerService();

	let videoElement = $state<HTMLVideoElement>();
	let cameraReady = $state(false);
	let cameraError = $state<string | null>(null);

	onMount(async () => {
		await faceService.init();
	});

	onDestroy(() => {
		faceService.destroy();
	});

	function handleCameraReady() {
		cameraReady = true;
		if (videoElement) {
			faceService.startPrediction(videoElement);
		}
	}

	function handleCameraError(msg: string) {
		cameraError = msg;
	}

	let combinedError = $derived(faceService.error || cameraError);
	let loading = $derived(!faceService.modelLoaded || !cameraReady);
</script>

<div class="relative h-screen w-full overflow-hidden bg-black text-gold-primary">
	<div class="absolute inset-0 z-0">
		<Webcam bind:videoElement onCameraReady={handleCameraReady} onError={handleCameraError} />
		<Scene landmarkRef={faceService.landmarksRef} {videoElement} {cameraReady} />
	</div>

	<div class="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]"
		></div>

		<div
			class="absolute inset-4 rounded-sm border border-gold-primary/10 shadow-[0_0_100px_inset] shadow-gold-primary/5 md:inset-8"
		>
			<svg
				class="absolute top-0 left-0 h-8 w-8 text-gold-primary/60 md:h-12 md:w-12"
				viewBox="0 0 48 48"
				fill="none"
			>
				<path d="M1 47V1H47" stroke="currentColor" stroke-width="1.5" />
				<rect x="0" y="0" width="4" height="4" fill="currentColor" />
			</svg>
			<svg
				class="absolute top-0 right-0 h-8 w-8 rotate-90 text-gold-primary/60 md:h-12 md:w-12"
				viewBox="0 0 48 48"
				fill="none"
			>
				<path d="M1 47V1H47" stroke="currentColor" stroke-width="1.5" />
				<rect x="0" y="0" width="4" height="4" fill="currentColor" />
			</svg>
			<svg
				class="absolute right-0 bottom-0 h-8 w-8 rotate-180 text-gold-primary/60 md:h-12 md:w-12"
				viewBox="0 0 48 48"
				fill="none"
			>
				<path d="M1 47V1H47" stroke="currentColor" stroke-width="1.5" />
				<rect x="0" y="0" width="4" height="4" fill="currentColor" />
			</svg>
			<svg
				class="absolute bottom-0 left-0 h-8 w-8 -rotate-90 text-gold-primary/60 md:h-12 md:w-12"
				viewBox="0 0 48 48"
				fill="none"
			>
				<path d="M1 47V1H47" stroke="currentColor" stroke-width="1.5" />
				<rect x="0" y="0" width="4" height="4" fill="currentColor" />
			</svg>
		</div>

		<header
			class="relative z-20 flex w-full flex-col items-center pt-8 transition-opacity duration-1000 md:pt-12"
		>
			<h1
				class="bg-linear-to-b from-gold-light via-gold-primary to-gold-dark bg-clip-text font-fantasy text-3xl tracking-[0.2em] text-transparent uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-6xl"
			>
				Orcifier
			</h1>
			<div class="mt-4 flex items-center gap-4 opacity-60">
				<div class="h-px w-12 bg-linear-to-r from-transparent to-gold-primary"></div>
				<div class="h-1.5 w-1.5 rotate-45 border border-gold-primary"></div>
				<div class="h-px w-12 bg-linear-to-l from-transparent to-gold-primary"></div>
			</div>
		</header>

		<footer class="relative z-20 flex flex-col items-center pb-8 opacity-60">
			<p class="text-[10px] font-bold tracking-[0.3em] text-gold-primary uppercase md:text-xs">
				Forged for the Horde
			</p>
		</footer>
	</div>

	<ControlPanel />
	<StatusOverlay {loading} error={combinedError} />
</div>
