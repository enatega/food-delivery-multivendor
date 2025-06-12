# Restaurant Delivery Management System

This project is a Restaurant Delivery Management System built with modern web technologies.

## Technologies Used

- **Next.js 14**
- **TypeScript**
- **UI Libraries**: Next UI, Chakra UI, or Prime React
- **React Icons** (if required)
- **Tailwind CSS**
- **Cypress** for:
  - Component Testing
  - Integration Testing
  - E2E Testing

## Build Size and Performance

- **Page Size**: Must be between 150KB.
- **Critical JS and CSS**: Must be below 100KB.
- **Bundle Analysis**: Use `webpack-bundle-analyzer` as a dev dependency to analyze the bundle.
- **Dynamic Imports**: Use dynamic imports in Next.js.
- **Image Optimization**: Use the `<Image/>` tag of Next.js.

### Performance Metrics

The app must follow the standard render times as follows:

- **First Contentful Paint (FCP)**: Under 1.8 seconds
- **Largest Contentful Paint (LCP)**: Under 2.5 seconds
- **First Input Delay (FID)**: Under 100 milliseconds
- **Time to Interactive (TTI)**: Under 5 seconds
- **Total Blocking Time (TBT)**: Under 300 milliseconds
- **Cumulative Layout Shift (CLS)**: Under 0.1
- **Speed Index (SI)**: Under 4.3 seconds
- **Time to First Byte (TTFB)**: Under 600 milliseconds
- **First Meaningful Paint (FMP)**: Under 2.5 seconds

Use the browser's Lighthouse tool for performance reports.

## Folder Structure

### `app` Folder

- Contains only routes and layouts.

### `cypress` Folder

- Contains only test cases

### `lib` Folder

- **hooks Folder**: Custom hooks (e.g., `useAuth`, `useConfiguration`).
- **hoc Folder**: Higher-order components (e.g., `Route Protection HOC`, `Data Refresh HOC`).
- **services Folder**: Services for different flows, third-party API calls (e.g. `Apollo`, `Geolocation API`).
  - create separate sub-folders.
- **ui Folder**: Reusable components, layouts, and screens.
- **utils Folder**:
  - **methods Folder**: Utility methods (e.g. string manipulation).
  - **interfaces Folder**: TypeScript interfaces (prefixed with "I").
  - **constants Folder**: Common constants (strings, headers).
  - **types Folder**: Custom TypeScript types, if necessary.

## Component Guidelines

- Divide complex components into sub-components (e.g., header, body, footer).
- Recommended code lines per component: `100-200 lines`.

## Changelog

- Log code changes in the `CHANGELOG.md` file.
- Only log merges/pushes to develop/staging/production branches.

---

```plaintext

├── .husky
│   └── git hooks
├── .vscode
│   └── IDE configuration
├── dist
│   └── built and minifed app.
├── .npmrc
│   └── npm configuration
├── .nvmrc
│   └── nvm configuration
├── cypress.config.ts
│   └── cypress configuration
├── app
│   └── routes
│   └── layouts
├── lib
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useConfiguration.ts
│   │   └── index.ts
│   ├── hoc
│   │   ├── withRouteProtection.ts
│   │   └── withDataRefresh.ts
│   │
│   ├── services
│   │   ├── support
│   │   │   ├── support.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── ui
│   │   ├── components
│   │   ├── layouts
│   │   └── screens
|   ├── utils
|   │   ├── methods
|   |   |   |   ├── string
|   │   │   |   |   ├── sort.ts
|   │   │   |   |   ├── toSentenceCase.ts
|   │   │   |   |   ├── index.ts
|   |   |   |   ├── regex
|   │   │   |   |   ├── email.ts
|   │   │   |   |   ├── password.ts
|   │   │   |   |   ├── url.ts
|   │   │   |   |   ├── index.ts
|   |   |   |   └── index. ts
|   │   ├── interfaces
|   │   │   ├── common
|   │   │   │   ├── IParent.ts
|   │   │   │   └── index.ts
|   │   │   ├── support.interface (sub-folders if required and index.ts for each)
|   │   │   └── index.ts
|   │   ├── constants
|   │   │   ├── strings
|   │   │   │   ├── global.strings.ts
|   │   │   │   └── support.strings (sub-folders if required and index.ts for each)
|   |   |   |   └── index.ts (export all above)
|   │   │   ├── headers
|   │   │   │   ├── global.headers.ts
|   │   │   │   └── support.headers (sub-folders if required and index.ts for each)
|   |   |   |   └──  index.ts (export all above)
|   │   │   └── index.ts
|   │   ├── types (same as interfaces)
|   │   │   └── index.ts
├── CHANGELOG.md
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

### Git

- **Commit Predefined Types**:
  - build
  - fix
  - refactor
  - revert
  - style
  - test
  - translation
  - security
  - changeset
  - config

### Note

- Under constant modifications.
