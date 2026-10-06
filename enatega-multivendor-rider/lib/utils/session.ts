export interface SessionInvalidationEvent {
  riderIdKey: string;
  tokenKey: string;
}

interface GraphQLErrorLike {
  extensions?: { code?: string };
  message?: string;
}

type SessionInvalidationListener = (event: SessionInvalidationEvent) => boolean;

const listeners = new Set<SessionInvalidationListener>();

export const hasCompleteRiderSession = (
  token: string | null,
  riderId: string | null,
) => Boolean(token && riderId);

export const subscribeToSessionInvalidation = (
  listener: SessionInvalidationListener,
) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const publishSessionInvalidation = (
  event: SessionInvalidationEvent,
) => {
  let handledCount = 0;
  listeners.forEach((listener) => {
    if (listener(event)) handledCount += 1;
  });
  return handledCount;
};

export const isInvalidRiderSessionError = (
  error: GraphQLErrorLike,
  operationName = "",
) => {
  const code = error.extensions?.code?.toUpperCase() ?? "";
  const message = error.message?.trim().toLowerCase() ?? "";

  if (["UNAUTHENTICATED", "TOKEN_EXPIRED", "INVALID_TOKEN"].includes(code)) {
    return true;
  }

  // The public proof gateway uses "Unauthorized: ..." errors too. Those must
  // refresh public access rather than destroy a valid rider login.
  if (
    message.startsWith("unauthorized:") ||
    message.includes("fingerprint") ||
    message.includes("public token") ||
    message.includes("bop-auth") ||
    message.includes("nonce")
  ) {
    return false;
  }

  if (
    message === "unauthorized" ||
    message.startsWith("unauthenticated") ||
    message.includes("access token expired") ||
    message === "invalid token" ||
    message.includes("token must be provided")
  ) {
    return true;
  }

  // A rider profile is the session identity. A forbidden/missing result here
  // means the stored rider id no longer belongs to the authenticated token.
  return (
    operationName.toLowerCase() === "rider" &&
    (code === "FORBIDDEN" ||
      message.includes("not authorized") ||
      message.includes("rider does not exist") ||
      message.includes("rider not found"))
  );
};
