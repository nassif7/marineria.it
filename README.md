## marineria.it mobile app

This is the **marineria.it** mobile app built with [Expo](https://expo.dev), Expo Router, React Native, Gluestack UI, and NativeWind.  
It provides two main flows:

- **Crew (pro)**: browse job offers, view offer details, and apply.
- **Recruiter (owner)**: manage searches, review candidate lists, and contact crew.

### Development

- **Install dependencies**

  ```bash
  npm install
  ```

- **Start the app**

  ```bash
  npx expo start
  ```

You can then run the app on a device, emulator, or the web from the Expo CLI UI.

### Project structure (high level)

- `app/`: Expo Router file-based routes (auth, tabs, pro, recruiter, settings).
- `components/ui/`: design system primitives powered by Gluestack UI + NativeWind.
- `components/appUI/`: higher-level app components (lists, layouts, gates).
- `api/`: typed API client functions talking to the marineria.it backend.
- `Providers/`: app-wide context providers (session, user, etc.).
- `localization/`: i18next configuration and translation resources.

### Linting & tests

- **Lint**

  ```bash
  npm run lint
  ```

- **Tests**

  ```bash
  npm test
  ```

### Notes

- Authentication state and role (crew/recruiter) are stored using secure storage and provided via context.
- API errors are normalized in `api/utils.ts` and can be mapped to localized messages via i18next.
