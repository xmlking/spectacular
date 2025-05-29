// this file defines the client plugins that is injected into the
// user's application
import type { ClientPlugin } from 'houdini';

const plugin: ClientPlugin = () => ({
  start(ctx, { next }) {
    const role = ctx.artifact.pluginData?.['@repo/role-houdini']?.role;
    if (role && ctx.fetchParams?.headers) {
      ctx.fetchParams.headers = { ...ctx.fetchParams.headers, 'x-hasura-role': role };
    }
    next(ctx);
  },
});

export default () => plugin;
