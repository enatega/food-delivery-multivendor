// Apollo Error Suppression Utility
// This utility suppresses known Apollo Client warnings that don't affect functionality

const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

const apolloWarningsToSuppress = [
  'An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err',
  'canonizeResults',
  'onCompleted',
  'onError'
];

const shouldSuppressMessage = (message) => {
  return apolloWarningsToSuppress.some(warning => 
    message && message.toString().includes(warning)
  );
};

export const suppressApolloWarnings = () => {
  console.warn = (...args) => {
    const message = args[0];
    if (!shouldSuppressMessage(message)) {
      originalConsoleWarn.apply(console, args);
    }
  };

  console.error = (...args) => {
    const message = args[0];
    if (!shouldSuppressMessage(message)) {
      originalConsoleError.apply(console, args);
    }
  };
};

export const restoreConsole = () => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
};