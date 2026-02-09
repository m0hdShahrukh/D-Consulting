# D Consulting React Builder Theme

This directory contains a WordPress theme scaffold that hosts a React-powered drag-and-drop page builder UI. It is intended as a foundation for implementing the full specification provided in `docs/wordpress-react-theme-spec.md`.

## Structure
- `style.css`: Theme metadata and base global styles.
- `functions.php`: Theme setup and asset registration.
- `index.php`: Theme entry template with a root element for the React app.
- `src/`: React application source code.

## Development
1. Install WordPress and place this folder into `wp-content/themes/`.
2. From this theme folder, install dependencies and build assets:
   ```bash
   npm install
   npm run build
   ```
3. Activate the theme in WordPress and navigate to the front end to see the builder shell.

## Running the Theme
1. Ensure the WordPress site is running (local stack, Docker, or hosting environment).
2. From the theme directory, run:
   ```bash
   npm install
   npm run build
   npm start
   ```
3. In WordPress admin, go to **DCRB Builder** in the left sidebar to open the builder UI.
4. Refresh the builder page to load the latest hot reload updates.
5. Use the front end to preview the theme shell if needed.

## Notes
- The React build output is expected in `build/` via `@wordpress/scripts`.
- This scaffold focuses on the builder layout, state model, and widget registry. Extend it with real widget renderers and REST endpoints.
