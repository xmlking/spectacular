<script lang="ts">
	import { page } from '$app/stores';
	// import { faBook, faGamepad, faHippo, faHouse, faLightbulb } from '@fortawesome/free-solid-svg-icons';
	// import Icon from 'svelte-awesome/components/Icon.svelte';
	const links = [
		{ href: '/', text: 'Home', /* icon: faHouse */},
		{ href: '/about', text: 'About', /* icon: faGamepad */},
		{ href: '/posts', text: 'Blog', /* icon: faBook */},
		{ href: '/posts', text: 'Posts', /* icon: faBook */},
		{ href: '/guides', text: 'Guides', /* icon: faBook */},
		{ href: '/contact', text: 'Contact', /* icon: faHippo */},
	];

	$: classesActive = (href: string) => {
        if (href !== '/') {
            return ($page.url.pathname.includes(href) ? 'variant-ghost-primary' : '');
        } else {
            return ($page.url.pathname === href ? 'variant-ghost-primary' : '');
        }
    }

</script>

<nav class="flex flex-row list-nav justify-center">
	{#each links as link}
		<a href={link.href} class={classesActive(link.href)}>
            <!-- <Icon data={link.icon} class="mr-2" /> -->
            {link.text}
        </a>
	{/each}
</nav>
