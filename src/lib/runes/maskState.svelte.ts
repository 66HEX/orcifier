export class MaskState {
	scale = $state(1.1);
	texture = $state('orc-1');
	
	color = $state('#ffffff');

	readonly textures = {
		'Orc 1': 'orc-1',
		'Orc 2': 'orc-2',
		'Goblin 1': 'goblin-1',
		'Goblin 2': 'goblin-2',
		'Lizardfolk 1': 'lizardfolk-1',
		'Lizardfolk 2': 'lizardfolk-2'
	};
}

export const maskState = new MaskState();
