<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { maskState } from '$lib/runes/maskState.svelte';
	import { FACE_MESH_TRIANGULATION } from '../utils/FaceTriangulation';
	import { FACE_MESH_UVS } from '../utils/FaceUVs';
	import type { FaceLandmarkRef } from '$lib/types';

	import orc1 from '$lib/assets/textures/orc-1.jpeg';
	import orc2 from '$lib/assets/textures/orc-2.jpeg';
	import goblin1 from '$lib/assets/textures/goblin-1.jpeg';
	import goblin2 from '$lib/assets/textures/goblin-2.jpeg';
	import lizardfolk1 from '$lib/assets/textures/lizardfolk-1.jpeg';
	import lizardfolk2 from '$lib/assets/textures/lizardfolk-2.jpeg';

	let { landmarkRef, videoElement } = $props<{
		landmarkRef: FaceLandmarkRef;
		videoElement: HTMLVideoElement | null;
	}>();

	const { camera, size } = useThrelte();

	let mesh = $state<THREE.Mesh>();
	let geometry = $state<THREE.BufferGeometry>();
	let material = $state<THREE.MeshPhysicalMaterial>();

	const vertexCount = 468;
	const indices = new Uint16Array(FACE_MESH_TRIANGULATION);
	const positions = new Float32Array(vertexCount * 3);
	const uvs = FACE_MESH_UVS;

	let texture = $state<THREE.Texture | null>(null);
	const textureLoader = new THREE.TextureLoader();

	const TEXTURE_MAP: Record<string, string> = {
		'orc-1': orc1,
		'orc-2': orc2,
		'goblin-1': goblin1,
		'goblin-2': goblin2,
		'lizardfolk-1': lizardfolk1,
		'lizardfolk-2': lizardfolk2
	};

	function updateTexture(key: string) {
		const url = TEXTURE_MAP[key];
		if (!url) return;

		textureLoader.load(
			url,
			(tex) => {
				tex.flipY = false;
				tex.colorSpace = THREE.SRGBColorSpace;
				texture = tex;
				if (material) {
					material.map = tex;
					material.needsUpdate = true;
				}
			},
			undefined,
			(err) => console.error('Error loading texture:', err)
		);
	}

	$effect(() => {
		updateTexture(maskState.texture);
	});

	$effect(() => {
		if (material) {
			material.map = texture;
			material.color.set(maskState.color);
			material.needsUpdate = true;
		}
	});

	useTask(() => {
		if (!landmarkRef.current?.faceLandmarks?.length || !videoElement || !geometry || !mesh) {
			if (mesh) mesh.visible = false;
			return;
		}

		mesh.visible = true;

		const cam = $camera as THREE.PerspectiveCamera;
		const distance = cam.position.z;
		const vFov = (cam.fov * Math.PI) / 180;

		const height = 2 * Math.tan(vFov / 2) * distance;
		const aspect = $size.width / $size.height;
		const width = height * aspect;

		let scaleX = width;
		let scaleY = height;

		if (videoElement.videoWidth && videoElement.videoHeight) {
			const videoAspect = videoElement.videoWidth / videoElement.videoHeight;
			const screenAspect = aspect;

			if (screenAspect > videoAspect) {
				scaleY = width / videoAspect;
			} else {
				scaleX = height * videoAspect;
			}
		}

		const face = landmarkRef.current.faceLandmarks[0];
		const posAttribute = geometry.attributes.position;

		const maskScale = maskState.scale;

		for (let i = 0; i < vertexCount; i++) {
			const lm = face[i];
			if (!lm) continue;

			const x = (0.5 - lm.x) * scaleX * maskScale;
			const y = -(lm.y - 0.5) * scaleY * maskScale;
			const z = -lm.z * scaleX * maskScale;

			posAttribute.setXYZ(i, x, y, z);
		}

		posAttribute.needsUpdate = true;
		geometry.computeVertexNormals();
	});
</script>

<T.Group>
	<T.Mesh bind:ref={mesh}>
		<T.BufferGeometry bind:ref={geometry}>
			<T.BufferAttribute
				args={[positions, 3]}
				attach="attributes.position"
				count={vertexCount}
				itemSize={3}
				usage={THREE.DynamicDrawUsage}
			/>
			<T.BufferAttribute args={[uvs, 2]} attach="attributes.uv" count={vertexCount} itemSize={2} />
			<T.BufferAttribute args={[indices, 1]} attach="index" count={indices.length} itemSize={1} />
		</T.BufferGeometry>

		<T.MeshPhysicalMaterial
			bind:ref={material}
			color={maskState.color}
			roughness={1.0}
			metalness={0.0}
			reflectivity={0.0}
			clearcoat={0.0}
			transparent={true}
			side={THREE.DoubleSide}
		/>
	</T.Mesh>
</T.Group>
