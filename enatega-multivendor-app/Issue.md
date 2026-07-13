# RTL/LTR Language Issue resolved
## Key Changes Implemented

1. **Removed Unnecessary Listener:**
   - The `i18next.on('languageChanged')` listener that previously handled language changes and forced RTL/LTR direction has been removed.
2. **Utilizing `i18n.dir()` for Direction Handling:**
   - Instead of managing RTL/LTR direction manually, we now use the `i18n.dir()` function. This method automatically determines whether the app should use a right-to-left (RTL) or left-to-right (LTR) layout based on the selected language of the application.

3. **Updated App Configuration (`app.json`):**
   - In order to support application level language and ensure the app's language direction is handled properly, the `supportsRTL` and `forcesRTL` flags in `app.json` have been set to `false`.

### Sample `app.json` Configuration:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "project-id"
      },
      "supportsRTL": false,
      "forcesRTL": false
    },
    "plugins": [
      ["expo-localization"]
    ]
  }
}

