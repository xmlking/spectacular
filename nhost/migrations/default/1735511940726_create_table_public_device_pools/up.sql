CREATE TABLE public.device_pools
(
  device_id uuid NOT NULL,
  pool_id   uuid NOT NULL,
  PRIMARY KEY (device_id, pool_id),
  FOREIGN KEY (device_id) REFERENCES public.devices (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (pool_id) REFERENCES public.pools (id) ON UPDATE RESTRICT ON DELETE CASCADE
);
COMMENT ON TABLE public.device_pools IS 'Device to Pool association table';
---
CREATE FUNCTION public.device_associated_pools(device_row public.devices) RETURNS SETOF public.pools
  LANGUAGE sql
  STABLE AS
$$
SELECT *
FROM pools
WHERE id IN (SELECT pool_id FROM public.device_pools WHERE device_id = device_row.id)
$$;
COMMENT ON FUNCTION public.device_associated_pools(device_row public.devices) IS 'Used as Computed Field on Devices Table';
---
CREATE FUNCTION public.device_dissociated_pools(device_row public.devices) RETURNS SETOF public.pools
  LANGUAGE sql
  STABLE AS
$$
SELECT *
FROM pools
WHERE id NOT IN (SELECT pool_id FROM public.device_pools WHERE device_id = device_row.id)
$$;
COMMENT ON FUNCTION public.device_dissociated_pools(device_row public.devices) IS 'Used as Computed Field on Devices Table';