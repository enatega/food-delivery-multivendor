export const cancelOrder = `#graphql
          mutation($abortOrderId: String!){
            abortOrder(id: $abortOrderId) {
              _id
              orderStatus
            }
          }`;
