<script lang="ts">
	export type ThemeConfig = {
		text?: string;
		name: string;
	}[];

	export const theme: ThemeConfig = [
		{
			name: 'light',
			text: '🌕 Light'
		},
		{
			name: 'dark',
			text: '🌑 Dark'
		},
		{
			name: 'cupcake',
			text: '🧁 Cupcake'
		},
		{
			name: 'bumblebee',
			text: '🐝 Bumblebee'
		}
	];
</script>
