/* eslint-disable @typescript-eslint/no-require-imports, no-console, no-undef */
const fs = require("node:fs");
const WebSocket = require("ws");

const DEFAULT_GRAPHQL_URL = "https://3086ptqf-8001.inc1.devtunnels.ms/graphql";
const DEFAULT_WS_URL = "wss://3086ptqf-8001.inc1.devtunnels.ms/graphql";

const readCredentials = () => {
  const envUsername = process.env.SINGLE_VENDOR_STORE_USERNAME;
  const envPassword = process.env.SINGLE_VENDOR_STORE_PASSWORD;
  if (envUsername && envPassword) {
    return { username: envUsername, password: envPassword };
  }

  const [username, password] = fs
    .readFileSync(0, "utf8")
    .split(/\r?\n/)
    .map((value) => value.trim());

  if (!username || !password) {
    throw new Error(
      "Provide username and password on separate stdin lines or through the SINGLE_VENDOR_STORE_USERNAME and SINGLE_VENDOR_STORE_PASSWORD environment variables.",
    );
  }
  return { username, password };
};

const request = async ({
  graphqlUrl,
  operationName,
  query,
  variables,
  token,
}) => {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-platform": "mobile",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ operationName, query, variables }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    const details =
      payload.errors?.map((error) => error.message).join("; ") ??
      `HTTP ${response.status}`;
    throw new Error(`${operationName}: ${details}`);
  }
  console.log(`PASS ${operationName}`);
  return payload.data;
};

const validateSubscription = async ({ wsUrl, token, restaurantId }) => {
  await new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl, "graphql-ws");
    let settled = false;
    let operationStarted = false;
    let timer = setTimeout(
      () => finish(() => reject(new Error("Subscription timed out"))),
      9000,
    );

    const finish = (callback) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (socket.readyState === WebSocket.OPEN) {
        if (operationStarted) {
          socket.send(JSON.stringify({ id: "store-smoke", type: "stop" }));
        }
        socket.send(JSON.stringify({ type: "connection_terminate" }));
        socket.close();
      } else {
        socket.terminate();
      }
      callback();
    };

    socket.on("open", () => {
      socket.send(
        JSON.stringify({
          type: "connection_init",
          payload: {
            authorization: `Bearer ${token}`,
            "x-platform": "mobile",
          },
        }),
      );
    });

    socket.on("message", (rawMessage) => {
      const message = JSON.parse(rawMessage.toString());
      if (message.type === "connection_ack") {
        operationStarted = true;
        socket.send(
          JSON.stringify({
            id: "store-smoke",
            type: "start",
            payload: {
              query: `
                subscription StoreOrderHandshake($restaurant: String!) {
                  subscribePlaceOrder(restaurant: $restaurant) {
                    origin
                    order {
                      _id
                      orderId
                    }
                  }
                }
              `,
              variables: { restaurant: restaurantId },
            },
          }),
        );
        clearTimeout(timer);
        timer = setTimeout(() => finish(resolve), 1500);
        return;
      }

      if (message.type === "connection_error" || message.type === "error") {
        finish(() =>
          reject(
            new Error(
              message.payload?.message ??
                JSON.stringify(message.payload) ??
                "Subscription failed",
            ),
          ),
        );
      }
    });

    socket.on("error", (error) => finish(() => reject(error)));
    socket.on("close", () => {
      if (!settled) {
        finish(() =>
          reject(
            new Error("Subscription socket closed before it was accepted"),
          ),
        );
      }
    });
  });
  console.log("PASS StoreOrderSubscriptionHandshake");
};

const main = async () => {
  const { username, password } = readCredentials();
  const graphqlUrl =
    process.env.SINGLE_VENDOR_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL;
  const wsUrl = process.env.SINGLE_VENDOR_WS_URL ?? DEFAULT_WS_URL;

  const loginData = await request({
    graphqlUrl,
    operationName: "StoreLoginSmokeTest",
    query: `
      mutation StoreLoginSmokeTest($username: String!, $password: String!) {
        restaurantLogin(username: $username, password: $password) {
          token
          restaurantId
        }
      }
    `,
    variables: { username, password },
  });
  const token = loginData?.restaurantLogin?.token;
  const restaurantId = loginData?.restaurantLogin?.restaurantId;
  if (!token || !restaurantId) {
    throw new Error("Login response did not include a token and restaurant ID");
  }

  await request({
    graphqlUrl,
    token,
    operationName: "StoreConfigurationSmokeTest",
    query: `
      query StoreConfigurationSmokeTest {
        configuration {
          _id
          currency
          currencySymbol
          restaurantAppSentryUrl
        }
      }
    `,
  });

  await request({
    graphqlUrl,
    token,
    operationName: "StoreProfileSmokeTest",
    query: `
      query StoreProfileSmokeTest($restaurantId: String!) {
        restaurant(id: $restaurantId) {
          _id
          name
          isAvailable
          enableNotification
          bussinessDetails {
            bankName
            accountNumber
          }
          openingTimes {
            day
            times {
              startTime
              endTime
            }
          }
        }
      }
    `,
    variables: { restaurantId },
  });

  await request({
    graphqlUrl,
    token,
    operationName: "StoreOrdersSmokeTest",
    query: `
      query StoreOrdersSmokeTest {
        restaurantOrders {
          _id
          orderId
          orderStatus
          status
        }
      }
    `,
  });

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);

  await request({
    graphqlUrl,
    token,
    operationName: "StoreEarningsGraphSmokeTest",
    query: `
      query StoreEarningsGraphSmokeTest(
        $storeId: ID!
        $startDate: String
        $endDate: String
      ) {
        storeEarningsGraph(
          storeId: $storeId
          page: 1
          limit: 5
          startDate: $startDate
          endDate: $endDate
        ) {
          totalCount
          earnings {
            _id
            totalEarningsSum
          }
        }
      }
    `,
    variables: {
      storeId: restaurantId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  await request({
    graphqlUrl,
    token,
    operationName: "StoreWalletSmokeTest",
    query: `
      query StoreWalletSmokeTest($storeId: String) {
        earnings {
          data {
            grandTotalEarnings {
              storeTotal
            }
          }
        }
        transactionHistory {
          data {
            status
            amountTransferred
            createdAt
          }
        }
        storeCurrentWithdrawRequest(storeId: $storeId) {
          _id
          requestAmount
          status
          createdAt
        }
      }
    `,
    variables: { storeId: restaurantId },
  });

  await validateSubscription({ wsUrl, token, restaurantId });
};

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
