// this file defines the client plugins that is injected into the
// user's application
import type { ClientPlugin } from 'houdini';

const plugin: ClientPlugin = () => ({
  start(ctx, { next }) {
    const {
      artifact: { pluginData },
      metadata,
    } = ctx;
    const role = pluginData?.['@spectacular/role-houdini']?.role;

    if (role && !metadata?.useRole) {
      console.log('setting role:', role);
      if (metadata) metadata.useRole = role;
      else ctx.metadata = { useRole: role };
    }

    next(ctx);
  },
});

export default () => plugin;
