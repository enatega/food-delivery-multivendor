export const createActivity = `#graphql
   mutation createActivity(
      $groupId: String!
      $module: String!
      $screenPath: String!
      $type: String!
      $details: String!
    ) {
        createActivity(
          groupId:$groupId
          module: $module
          screenPath: $screenPath
          type: $type
          details: $details
      )
    }
`;
