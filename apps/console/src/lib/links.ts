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
        { href: '/ai/smart', label: 'Smart Components', keywords: 'Smart Components, ai, completion' },
        { href: '/ai/speech', label: 'Speech', keywords: 'Lang, Speech' },
        { href: '/ai/writing', label: 'Smart Writing', keywords: 'Smart Components, ai, writing' },
        { href: '/ai/pastesmart', label: 'Smart Paste', keywords: 'Smart Paste, ai, smart-forms' },
        { href: '/ai/assistants', label: 'Assistants', keywords: 'assistants, smart-forms, ai' },
        { href: '/ai/ragapps', label: 'RAG Apps', keywords: 'RAG, ai, completion' },
        { href: '/ai/chat', label: 'Chat', keywords: 'chat, OpenAI' },
        { href: '/ai/bot', label: 'Chat Bot', keywords: 'chatbot, OpenAI' },
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
  '/settings': [
    {
      title: 'Account',
      list: [
        { href: '/profile', label: 'Profile', keywords: 'settings, profile, account' },
        { href: '/signup?redirectTo=/dashboard', label: 'Signup', keywords: 'signup, account' },
        { href: '/signin?redirectTo=/dashboard', label: 'Signin', keywords: 'signin, login, account' },
        { href: '/settings', label: 'AI Settings', keywords: 'settings, ai, account', badge: '✨' },
        { href: '/feature-flags', label: 'Feature Flags', keywords: 'settings, feature-flags, account' },
      ],
    },
    {
      title: 'Organization',
      list: [
        { href: '/organization', label: 'Organization', keywords: 'organization', roles: [Roles.Owner, Roles.Admin] },
        { href: '/org-settings', label: 'Configuration', keywords: 'settings, configuration, environment-variables, organization', roles: [Roles.Owner, Roles.Admin] },
        { href: '/org-feature-flags', label: 'Features', keywords: 'settings, feature-flags, organization', roles: [Roles.Owner, Roles.Admin] },
        { href: '/users', label: 'Members', keywords: 'account, user, member, organization', roles: [Roles.Owner, Roles.Admin] },
        { href: '/groups', label: 'User Groups', keywords: 'account, group, organization', roles: [Roles.Owner, Roles.Admin] },
        { href: '/billing', label: 'Billing', keywords: 'billing, plan, organization', roles: [Roles.Owner, Roles.Billing] },
        { href: '/invoices', label: 'Invoices', keywords: 'billing, invoices, organization', roles: [Roles.Owner, Roles.Billing] },
        { href: '/organizations/create', label: '＋ New Organization', keywords: 'create, organization' },
      ],
    },
    {
      title: 'Sys Admin',
      list: [
        {
          href: '/organizations',
          label: 'Organizations',
          keywords: 'system, admin, organization',
          roles: [Roles.SysAdmin],
        },
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
