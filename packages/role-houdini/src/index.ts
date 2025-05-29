// import type * as graphql from 'graphql';
import type { OperationDefinitionNode, StringValueNode } from 'graphql';
import { ArtifactKind, plugin } from 'houdini';

export default plugin('role-houdini', async () => {
  return {
    // add the @role directive
    schema() {
      return `
              directive @role(
                name: String!
              ) on QUERY
            `;
    },

    /**
     * Add the client plugin to the runtime
     */
    clientPlugins: {
      '@repo/role-houdini/client': null,
    },

    /** Configure the default set of scalars supported by Hasura */
    config: '@repo/role-houdini/config',

    /**
     * We want to perform special logic for the the @role directive so we're going to persist
     * data in the artifact if we detect it
     */
    artifactData({ document }) {
      // only consider queries
      if (document.kind !== ArtifactKind.Query) {
        return;
      }

      // look at the original document the user passed (only one definition)
      const queryDefinition = document.originalParsed.definitions[0] as OperationDefinitionNode;

      // consider the artifact `role` if the query contains the `role` directive
      const role = queryDefinition?.directives?.find((directive) => directive.name.value === 'role');
      const value = (role?.arguments?.[0].value as StringValueNode)?.value;
      // console.debug(`Document: ${document.name}, Role: ${value}`);
      return { role: value };
    },
  };
});
