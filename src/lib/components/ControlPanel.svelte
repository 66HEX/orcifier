<script lang="ts">
	import { maskState } from '$lib/runes/maskState.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let isOpen = $state(false);
	let panelRef = $state<HTMLDivElement>();
	let triggerRef = $state<HTMLButtonElement>();

	function togglePanel() {
		isOpen = !isOpen;
	}

	function handleOutsideClick(event: MouseEvent) {
		if (
			isOpen &&
			panelRef &&
			!panelRef.contains(event.target as Node) &&
			triggerRef &&
			!triggerRef.contains(event.target as Node)
		) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div
	class="pointer-events-none fixed top-8 right-8 z-50 flex flex-col items-end font-fantasy md:top-16 md:right-16"
>
	<button
		bind:this={triggerRef}
		onclick={togglePanel}
		class="group pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/30 bg-black/40 text-gold-primary backdrop-blur-md transition-all duration-300 hover:border-gold-primary hover:bg-black/60 hover:shadow-[0_0_20px] hover:shadow-gold-primary/20 focus:outline-none active:scale-95"
		aria-label="Toggle Artifact Controls"
	>
		<svg
			class="h-6 w-6 transition-transform duration-500 group-hover:rotate-180"
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			fill="currentColor"
			viewBox="0 0 256 256"
			><path
				d="M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z"
			></path></svg
		>
	</button>

	{#if isOpen}
		<div
			bind:this={panelRef}
			transition:fly={{ x: 50, duration: 400, easing: cubicOut }}
			class="pointer-events-auto mt-4 w-80 overflow-hidden rounded-xl border border-gold-primary/20 bg-panel-bg/95 p-0 shadow-2xl shadow-black backdrop-blur-xl"
		>
			<div class="relative border-b border-gold-primary/10 bg-black/20 px-6 py-4">
				<h2 class="text-sm font-bold tracking-[0.25em] text-gold-light uppercase">
					Character Stats
				</h2>
				<div
					class="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-gold-primary/50 to-transparent"
				></div>
			</div>

			<div class="space-y-8 p-6">
				<div class="relative">
					<label
						for="skin-select"
						class="mb-3 block text-[10px] font-bold tracking-[0.2em] text-gold-primary/60 uppercase"
					>
						Race
					</label>
					<div class="group relative">
						<select
							id="skin-select"
							bind:value={maskState.texture}
							class="w-full appearance-none rounded-lg border border-gold-primary/20 bg-black/40 px-4 py-3 text-xs font-bold tracking-wider text-gold-primary uppercase transition-colors focus:border-gold-primary/60 focus:bg-black/60 focus:outline-none"
						>
							{#each Object.entries(maskState.textures) as [label, value] (value)}
								<option {value} class="bg-gray-900 text-gold-primary">{label}</option>
							{/each}
						</select>
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold-primary/50 transition-colors group-hover:text-gold-primary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div>
					<div class="mb-3 flex items-end justify-between">
						<label
							for="scale-range"
							class="text-[10px] font-bold tracking-[0.2em] text-gold-primary/60 uppercase"
						>
							Scale Projection
						</label>
						<span class="font-mono text-xs text-gold-light">{maskState.scale.toFixed(2)}x</span>
					</div>
					<div class="relative flex h-6 w-full items-center">
						<input
							id="scale-range"
							type="range"
							min="0.5"
							max="2.0"
							step="0.01"
							bind:value={maskState.scale}
							class="slider-thumb absolute z-20 h-full w-full cursor-pointer opacity-0"
						/>
						<div
							class="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/10"
						>
							<div
								class="h-full bg-gold-primary transition-all duration-75"
								style="width: {((maskState.scale - 0.5) / 1.5) * 100}%"
							></div>
						</div>
						<div
							class="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold-primary bg-black shadow-[0_0_10px] shadow-gold-primary/50 transition-all duration-75"
							style="left: {((maskState.scale - 0.5) / 1.5) * 100}%"
						></div>
					</div>
				</div>
			</div>

			<div
				class="h-1 w-full bg-linear-to-r from-transparent via-gold-primary/20 to-transparent"
			></div>
		</div>
	{/if}
</div>
