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
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="h-6 w-6 transition-transform duration-500 group-hover:rotate-180"
		>
			<path
				d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
			<circle cx="12" cy="12" r="3" class="opacity-50" />
		</svg>
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
