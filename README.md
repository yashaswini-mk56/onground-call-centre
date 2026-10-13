
# On-Ground.ai Call Centre App

A React-based demonstration of a call centre application for managing leads, customer calls, follow-ups, team communication and agent activity.

## Tech Stack

- React
- Vite
- JavaScript (JSX)
- CSS
- Lucide React for icons
- Local sample data and React state

React was chosen to build reusable UI components and manage interactive screens. Vite provides a simple development server and production build.

## Features

- Dashboard with agent metrics, progress, earnings, tasks and a weekly calls chart
- Planner with Calls to make, Incoming and Recent tabs
- Expandable lead details and lead profile navigation
- Callback demo interactions (no real call is placed)
- Browser-to-browser voice and video call demo (PeerJS) on the Voice Call page
- Calendar with month navigation and sample follow-ups
- Pulse home (AvaniBot, role/task agents, Kudos, channels) and channel chat
- Leads modal with collapsible buying signals and first/last-record handling
- Message sending and Needs your input actions
- Responsive layout for narrower screens

## Setup

Prerequisites: Node.js and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/yashaswini-mk56/onground-call-centre.git
   cd onground-call-centre
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in the terminal.

## Production Build

Run:

```bash
npm run build
```

Vite generates the production output in the `dist` directory.

## Data and Limitations

This assignment uses sample data and client-side state. It does not connect to a backend, place real phone calls, or persist all interactions to a server. Call and callback actions are demonstrations only. Calling status: Plan and dashboard callbacks are simulated; the Voice Call page is a real browser-to-browser audio call between two browser windows (PeerJS), not a phone call. The same page offers a browser-to-browser video call (PeerJS). Phone/Twilio calling and human-to-AI voice conversation are not implemented. Data may reset when the application is reloaded.

## AI Tools and Development

ChatGPT and Claude were used for implementation guidance, debugging, CSS corrections and documentation assistance. The code was tested locally during development. The author is responsible for reviewing the implementation and explaining its behaviour.

## Future Improvements

- Connect the interface to a backend and persistent database
- Integrate a real telephony service
- Add automated tests and stronger error handling
- Improve accessibility and validate the interface across screen sizes

## How to Try the Main Interactions

1. Dashboard: click "2 hot leads" to open the Leads modal; use Previous/Next and the Buying signals toggle.
2. Plan: open Calls to make (expand rows, paginate), Incoming (Call back), and Recent (Review).
3. Calendar: use Previous/Next and Today; click a date to see its events.
4. Pulse: open a channel, use Confirmed or Reschedule, send a message, then use Channels to go back.
