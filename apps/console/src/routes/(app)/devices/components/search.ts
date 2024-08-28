import { searchDevicesFn } from '$lib/api/search-devices';
import type { DeviceSearch } from '$lib/schema/device';
import type { GraphQLError } from 'graphql';

interface GQLResult<T> {
  data: T | undefined;
  errors: Partial<GraphQLError>[] | undefined;
}

export interface Device {
  id: string;
  displayName: string;
  description: string;
  ip: string;
  proxy_ip: boolean;
  alternate_dns: boolean;
  public_ip: string | null;
}

export async function searchDevices(filter: DeviceSearch): Promise<GQLResult<Device[]>> {
  return await searchDevicesFn(filter.displayName || '');
}
