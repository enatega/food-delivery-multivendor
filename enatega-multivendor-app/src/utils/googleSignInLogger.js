// Deep-inspection logging helper for the customer Google Sign-In flow.
//
// The goal is to make it obvious *where* a Google login breaks — at
// configuration, at the native/OAuth prompt, at token extraction, or at the
// backend `login` mutation. Every step logs a consistently prefixed line so
// the sequence can be followed in Metro / device logs.
//
// Tokens are never printed in full: only a short prefix + length so the log is
// useful for debugging (was a token present? how long?) without leaking a
// usable credential into log storage.

const PREFIX = '[GoogleSignIn]'

// Toggle to silence in production if needed. Left on so the whole flow is
// inspectable while the sign-in issue is being diagnosed.
const ENABLED = true

// Redact a token/secret down to a fingerprint that is safe to log.
export const redactToken = (token) => {
  if (token === null || token === undefined) return `<${token}>`
  if (typeof token !== 'string') return `<non-string:${typeof token}>`
  if (token.length === 0) return '<empty-string>'
  const head = token.slice(0, 8)
  const tail = token.slice(-4)
  return `${head}…${tail} (len:${token.length})`
}

// Log a labelled step. `data` is optional structured context.
export const logStep = (step, data) => {
  if (!ENABLED) return
  if (data === undefined) {
    console.log(`${PREFIX} ${step}`)
  } else {
    console.log(`${PREFIX} ${step}`, data)
  }
}

// Log an error with as much shape as we can pull off it.
export const logError = (step, error) => {
  if (!ENABLED) return
  console.log(`${PREFIX} ✗ ${step}`, {
    code: error?.code,
    name: error?.name,
    message: error?.message,
    graphQLErrors: error?.graphQLErrors?.map((e) => e?.message),
    networkError: error?.networkError?.message,
    statusCode: error?.networkError?.statusCode,
    stack: error?.stack
  })
}

// Summarise a raw Google user-info payload without dumping the whole object
// (which can carry tokens on some SDK versions).
export const describeGoogleUser = (userInfo) => {
  const user = userInfo?.user ?? userInfo
  return {
    hasUser: !!user,
    email: user?.email ?? null,
    name: user?.name ?? null,
    hasPhoto: !!user?.photo,
    id: user?.id ?? null,
    // Some SDK shapes nest the token under `.data`
    idTokenTopLevel: redactToken(userInfo?.idToken),
    idTokenNested: redactToken(userInfo?.data?.idToken)
  }
}

// Summarise the payload we send to the backend `login` mutation.
export const describeLoginPayload = (user) => ({
  type: user?.type,
  email: user?.email ?? null,
  name: user?.name ?? null,
  hasPicture: !!user?.picture,
  phone: user?.phone ?? null,
  idToken: redactToken(user?.idToken)
})
