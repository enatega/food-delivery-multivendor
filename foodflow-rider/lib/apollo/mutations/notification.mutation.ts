export const updateNotificationStatus = `#graphql
          mutation UpdateNotificationStatus($offerNotification:Boolean!,$orderNotification:Boolean!){
            updateNotificationStatus(offerNotification:$offerNotification,orderNotification:$orderNotification){
              _id
              notificationToken
              isOrderNotification
              isOfferNotification
            }
          }`;
