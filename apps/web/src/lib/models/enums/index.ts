export const limits = [
	{ value: 5, name: '5' },
	{ value: 10, name: '10' },
	{ value: 20, name: '20' },
	{ value: 50, name: '50' },
	{ value: 100, name: '100' }
];

export const rows = [
	{ value: 5, name: '5' },
	{ value: 10, name: '10' },
	{ value: 20, name: '20' },
	{ value: 50, name: '50' },
	{ value: 100, name: '100' }
];

export const subjectTypeOptions = [
	{ value: '', name: 'All' },
	{ value: 'user', name: 'User' },
	{ value: 'group', name: 'Group' },
	{ value: 'service_account', name: 'Service' },
	{ value: 'device', name: 'Device' },
	{ value: 'device_pool', name: 'Device Pool' }
];

export const subjectTypeOptions2 = [
	{
		value: 'user',
		label: 'User'
	},
	{
		value: 'group',
		label: 'Group'
	},
	{
		value: 'device',
		label: 'Device'
	},
	{
		value: 'device_pool',
		label: 'Device Pool'
	}
];

export const protocols = [
	{ value: 'Any', name: 'Any' },
	{ value: 'IP', name: 'IP' },
	{ value: 'ICMP', name: 'ICMP' },
	{ value: 'IGMP', name: 'IGMP' },
	{ value: 'TCP', name: 'TCP' },
	{ value: 'UDP', name: 'UDP' },
	{ value: 'IPV6', name: 'IPV6' },
	{ value: 'ICMPV6', name: 'ICMPV6' },
	{ value: 'RM', name: 'RM' }
];

export const actionOptions = [
	{
		value: 'permit',
		label: 'Allow'
	},
	{
		value: 'block',
		label: 'Deny'
	}
];

export const directionOptions = [
	{
		value: 'egress',
		label: 'Egress' // Outbound
	},
	{
		value: 'ingress',
		label: 'Ingress' // Inbound
	}
];
