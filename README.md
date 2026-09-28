# Bevo’s Pack

A responsive React + TypeScript single-page website template for Bevo’s Pack, a personal dog walking and training business.

## Run locally

Use Node.js 20.19 or newer. If Node was installed with nvm, load it in the terminal with `source "$HOME/.nvm/nvm.sh"` before running npm commands.

```sh
npm install
npm run dev
```

Create and preview a production build with `npm run build` and `npm run preview`.

## Deploy with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the site whenever you push to `main`.

1. Create a GitHub repository for the site and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
3. If using live Google Calendar availability, add a repository Actions variable named `VITE_AVAILABILITY_ENDPOINT` containing the Apps Script `/exec` URL. The endpoint URL is public; calendar IDs remain in Apps Script. If unset, the site builds but reports availability as unconfigured.
4. Push to `main` or manually run **Deploy to GitHub Pages** from the Actions tab. The workflow detects the repository name and sets Vite's base path automatically, including root deployment for an `owner.github.io` repository.

For a project repository, the default site address is `https://OWNER.github.io/REPOSITORY/`. Configure a custom domain in **Settings → Pages** if desired.

## Included

- Hero with the business name, tagline, and booking call to action
- Services, rates, about, Google Calendar availability, photos, testimonials, and contact sections
- One-off walks: $35 for 30 minutes, $60 for 60 minutes; additional dog: $25 for 30 minutes or $40 for 60 minutes
- Monthly-in-advance walks: $30 for 30 minutes or $55 for 60 minutes
- Responsive navigation, keyboard focus styles, a skip link, semantic landmarks, labelled form fields, and reduced-motion support

## Google Calendar availability

The browser cannot access `CalendarApp` or `SpreadsheetApp` directly. The server-side endpoint is in `apps-script/Code.gs`; it reads calendar IDs from a spreadsheet-bound Apps Script and returns only available date/time slots. The client requests that public availability through JSONP to avoid cross-origin fetch restrictions. Calendar IDs and busy event details stay on the Google side.

1. Put a header in cell A1 and calendar IDs in A2 downward. The script supports either a tab named `CalendarConfig` or a spreadsheet file named `CalendarConfig` (using its first tab).
2. Share each client calendar with the Google account that owns the spreadsheet-bound Apps Script, with permission to read event availability.
3. From the sheet, open **Extensions > Apps Script**. Add the contents of `apps-script/Code.gs` as `Code.gs` and set the Apps Script project timezone to `America/Los_Angeles` (or the business timezone you use).
4. In Apps Script project settings, enable the `appsscript.json` manifest if needed and apply the scopes listed in `apps-script/appsscript.json`. Save, select `initializeCalendarConfig` in the function picker, and run it once from the bound script editor. This stores the spreadsheet ID for web-app requests. Authorize the script as the account that can read the calendars.
5. Deploy as a **Web app**, executing as the script owner. The deployment must allow anonymous access for the public site to read open slots. If Workspace policy blocks this, an authenticated server-side proxy is required; do not put credentials or calendar IDs in the frontend.
6. Copy `.env.example` to `.env.local`, replace `DEPLOYMENT_ID` with the deployed `/exec` URL, then restart the dev server or rebuild the site. Vite environment values are embedded at build time.

The weekly hours, 30-minute start increments, supported 30/60-minute walk lengths, and 15-minute post-event buffer are configured in `WEEKLY_TEMPLATE`, `SLOT_START_INTERVAL_MINUTES`, `AVAILABLE_DURATIONS_MINUTES`, and `BOOKING_BUFFER_MINUTES` in `apps-script/Code.gs`. The calendar stays unavailable in the site until `VITE_AVAILABILITY_ENDPOINT` is configured. Requests are not reservations; calendar events may change after slots are displayed, so confirm every inquiry before treating it as booked.

## Before publishing

- Replace remote Unsplash dog photos with images you own or have permission to use.
- Replace lorem ipsum and client-name placeholders with your business story and genuine reviews.
- Update the placeholder email and Instagram handle in `src/components/ContactSection.tsx`.
- Deploy the availability Apps Script endpoint and configure `.env.local` for the production build.
- Verify the Web3Forms recipient, submit a live test inquiry, and keep its access key restricted to the production domain if supported.
- Confirm your service area, booking terms, and pricing details.

The visual theme uses the supplied Golden Hour palette. Display fonts load from Google Fonts, with local serif and sans-serif fallbacks.
