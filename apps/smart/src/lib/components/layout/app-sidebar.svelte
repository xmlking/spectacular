<script lang="ts" module>
import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
import BookOpen from '@lucide/svelte/icons/book-open';
import Bot from '@lucide/svelte/icons/bot';
import ChartPie from '@lucide/svelte/icons/chart-pie';
import Command from '@lucide/svelte/icons/command';
import FlaskRound from '@lucide/svelte/icons/flask-round';
import Frame from '@lucide/svelte/icons/frame';
import GalleryVerticalEnd from '@lucide/svelte/icons/gallery-vertical-end';
import MapIcon from '@lucide/svelte/icons/map';
import Settings2 from '@lucide/svelte/icons/settings-2';
import Sparkles from '@lucide/svelte/icons/sparkles';
import SquareTerminal from '@lucide/svelte/icons/square-terminal';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
        {
          title: 'Todos',
          url: '/todos',
        },
      ],
    },
    {
      title: 'Smart',
      url: '#',
      icon: Sparkles,
      items: [
        {
          title: 'Debounce',
          url: '/examples/debounce',
        },
        {
          title: 'Debounce Runed',
          url: '/examples/debounce-runed',
        },
        {
          title: 'Hover',
          url: '/examples/hover',
        },
        {
          title: 'ClickOutside',
          url: '/examples/click-outside',
        },
      ],
    },
    {
      title: 'Examples',
      url: '#',
      icon: FlaskRound,
      items: [
        {
          title: 'Debounce',
          url: '/examples/debounce',
        },
        {
          title: 'Debounce Runed',
          url: '/examples/debounce-runed',
        },
        {
          title: 'Hover',
          url: '/examples/hover',
        },
        {
          title: 'ClickOutside',
          url: '/examples/click-outside',
        },
        {
          title: 'Data Table',
          url: '/examples/data-table',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: ChartPie,
    },
    {
      name: 'Travel',
      url: '#',
      icon: MapIcon,
    },
  ],
};
</script>

<script lang="ts">
	import NavMain from "$lib/components/layout/nav-main.svelte";
	import NavProjects from "$lib/components/layout/nav-projects.svelte";
	import NavUser from "$lib/components/layout/nav-user.svelte";
	import TeamSwitcher from "$lib/components/layout/team-switcher.svelte";
	import * as Sidebar from "@repo/ui/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
