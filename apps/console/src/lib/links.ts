// Navigation Sitemap
// `blockPreload: 'false'` means adding data-sveltekit-preload-data="false" to link.

import { Roles } from './types';
import type { MenuNavLinks } from './types';

export const menuNavLinks: MenuNavLinks = {
  '/policies': [
    {
      title: '',
      list: [{ href: '/dashboard', label: 'Dashboard', keywords: 'reports, graph' }],
    },
    {
      title: 'Policies',
      list: [
        { href: '/policies', label: 'Policies', keywords: 'svelte, sirens, license, release', preload: 'false' },
        { href: '/rules', label: 'Golden Rules', keywords: 'start, install, cli, tailwind, themes, stylesheets' },
      ],
    },
    {
      title: 'Devices',
      list: [
        { href: '/devices', label: 'Devices', keywords: 'start, setup, tutorial, guide' },
        { href: '/pools', label: 'Pools', keywords: 'start, setup, tutorial, guide' },
      ],
    },
    {
      title: 'Experiments',
      list: [{ href: '/customers', label: 'Customers', keywords: 'customers, users' }],
    },
    {
      title: 'AI',
      list: [
        { href: '/magic-spell', label: 'Magic Spell', keywords: 'magic-spell, ai, completion' },
        { href: '/assistants', label: 'Assistants', keywords: 'assistants, smart-forms, ai' },
        { href: '/ragapps', label: 'RAG Apps', keywords: 'RAG, ai, completion' },
        { href: '/chatbot', label: 'Chat Bot', keywords: 'chatbot, OpenAI' },
      ],
    },
  ],
  '/flows': [
    {
      title: 'Visualization',
      list: [
        { href: '/network', label: 'Network', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
        { href: '/segments', label: 'Segments', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
      ],
    },
  ],
  '/reports': [
    {
      title: 'Reports',
      list: [
        { href: '/reports', label: 'Access Reports', keywords: 'copy, contenteditable, html, input' },
        { href: '/usage-reports', label: 'Usage Reports', keywords: 'usage' },
      ],
    },
  ],
  '/account': [
    {
      title: 'Settings',
      list: [
        { href: '/profile', label: 'Profile', keywords: 'account, settings, profile' },
        { href: '/feature-flags', label: 'Flags', keywords: 'account, settings, flags' },
      ],
    },
    {
      title: 'Auth',
      list: [
        { href: '/signup?redirectTo=/dashboard', label: 'Signup', keywords: 'signup, users' },
        { href: '/signin?redirectTo=/dashboard', label: 'Signin', keywords: 'signin, login, users' },
      ],
    },
    {
      title: 'Administration',
      list: [
        { href: '/organizations', label: 'Organizations', keywords: 'account, organization', roles: [Roles.Manager, Roles.Supervisor] },
        { href: '/delegation', label: 'Delegations', keywords: 'account, delegation', roles: [Roles.Manager, Roles.Supervisor] },
        { href: '/users', label: 'Users', keywords: 'account, user, admin', roles: [Roles.Manager, Roles.Supervisor] },
        { href: '/groups', label: 'Groups', keywords: 'account, group, admin', roles: [Roles.Manager, Roles.Supervisor] },
      ],
    },
  ],
};

// Build Inverted Index for fast lookup
type InvertedIndex = Record<string, string>;

const buildInvertedIndex = (menu: MenuNavLinks): InvertedIndex => {
  const invertedIndex: InvertedIndex = {};
  for (const topLevelKey of Object.keys(menu)) {
    const sections = menu[topLevelKey];
    for (const section of sections) {
      for (const item of section.list) {
        const key = item.href.split('/')[1];
        invertedIndex[key] = topLevelKey;
      }
    }
  }
  return invertedIndex;
};
export const hrefToCategoryIndex = buildInvertedIndex(menuNavLinks);
