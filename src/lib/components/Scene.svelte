<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import { WebGLRenderer } from 'three';
	import FaceMask from '$lib/components/FaceMask.svelte';
	import type { FaceLandmarkRef } from '$lib/types';

	let { landmarkRef, videoElement, cameraReady } = $props<{
		landmarkRef: FaceLandmarkRef;
		videoElement: HTMLVideoElement | undefined;
		cameraReady: boolean;
	}>();
</script>

<div class="absolute inset-0 z-10">
	<Canvas createRenderer={(canvas) => new WebGLRenderer({ canvas, alpha: true, antialias: true })}>
		<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

		<T.AmbientLight intensity={0.8} color="#0d1a0d" />

		<T.DirectionalLight position={[4, 2, 5]} intensity={3.5} color="#88aa55" />

		<T.DirectionalLight position={[-4, 0, 3]} intensity={2.0} color="#224433" />

		<T.DirectionalLight position={[0, 8, 0]} intensity={1.0} color="#ddeecc" />

		{#if cameraReady && videoElement}
			<FaceMask {landmarkRef} {videoElement} />
		{/if}
	</Canvas>
</div>
