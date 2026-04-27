export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  switch (env) {
    case "DEV":
      return {
        SERVER_URL:
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001/",
        WS_SERVER_URL:
          process.env.NEXT_PUBLIC_WS_SERVER_URL || "ws://localhost:8001/",
      };
    case "STAGE":
      return {
        SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001/",
        WS_SERVER_URL: process.env.NEXT_PUBLIC_WS_SERVER_URL || "ws://localhost:8001/",
      };
    case "PROD":
      return {
        SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001/",
        WS_SERVER_URL: process.env.NEXT_PUBLIC_WS_SERVER_URL || "ws://localhost:8001/",
      };
    default:
      return {
        SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8001/",
        WS_SERVER_URL: process.env.NEXT_PUBLIC_WS_SERVER_URL || "ws://localhost:8001/",
      };
  }
}
