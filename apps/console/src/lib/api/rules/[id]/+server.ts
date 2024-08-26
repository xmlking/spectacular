import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  // Replace this with actual database query
  const rule = {
    id: params.id,
    displayName: 'Sample Rule',
    description: 'This is a sample rule',
    tags: ['sample', 'test'],
    annotations: 'key1=>value1',
    source: '192.168.1.1',
    sourcePort: '80',
    destination: '10.0.0.1',
    destinationPort: '443',
    protocol: 'TCP',
    action: 'allow',
    direction: 'inbound',
    appId: 'app-123',
    throttleRate: 50,
    weight: 100,
    shared: false,
  };

  return json(rule);
};
