<script lang="ts">
	let { loading, error } = $props<{
		loading: boolean;
		error: string | null;
	}>();
</script>

{#if loading && !error}
	<div
		class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/95 text-gold-primary transition-opacity duration-700"
	>
		<div class="relative h-16 w-16">
			<div
				class="absolute inset-0 animate-spin rounded-full border border-t-2 border-gold-primary/30 border-t-gold-primary"
			></div>
			<div
				class="absolute inset-2 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-b-2 border-gold-primary/20 border-b-gold-light/80"
			></div>
			<div class="absolute inset-[40%] animate-pulse bg-gold-primary/20 blur-md"></div>
		</div>

		<p class="animate-pulse font-fantasy text-lg tracking-[0.3em] text-gold-primary/80 uppercase">
			Awakening...
		</p>
	</div>
{/if}

{#if error}
	<div
		class="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4 text-gold-primary backdrop-blur-sm"
	>
		<div
			class="group relative w-full max-w-md overflow-hidden border border-gold-primary/30 bg-black/80 p-8 text-center shadow-[0_0_40px] shadow-gold-primary/10 backdrop-blur-md"
		>
			<div class="absolute top-0 left-0 h-2 w-2 border-t border-l border-gold-primary"></div>
			<div class="absolute top-0 right-0 h-2 w-2 border-t border-r border-gold-primary"></div>
			<div class="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-gold-primary"></div>
			<div class="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-gold-primary"></div>

			<h3 class="mb-4 text-xs font-bold tracking-[0.4em] text-red-500/80 uppercase drop-shadow-sm">
				Ritual Interrupted
			</h3>
			<p
				class="text-sm leading-relaxed font-medium tracking-wider text-gold-primary/90 uppercase md:text-base"
			>
				{error}
			</p>
		</div>
	</div>
{/if}
