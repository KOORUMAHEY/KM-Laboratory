# Lab Status Central

Lab Status Central is a full-stack web application for monitoring and managing lab experiment statuses. Built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/), it features a modern UI, admin editing, and AI-powered code suggestions.

## Features

- **Lab Dashboard:** Browse lab categories and experiments.
- **Experiment Details:** Track status, code snippets, and resources.
- **Admin Mode:** Secure editing (triple-click title to unlock).
- **AI Suggestions:** Generate code snippets using Genkit.
- **Responsive Design:** Mobile-friendly sidebar, dialogs, and navigation.
- **Theming:** Light/dark mode toggle via [next-themes](https://github.com/pacocoursey/next-themes).
- **Rich UI Components:** Built with Radix UI, Lucide icons, and Tailwind CSS.

## Tech Stack

- **Frontend:** Next.js App Router, React 19, TypeScript, Tailwind CSS
- **State Management:** React hooks, context providers
- **Database:** Drizzle ORM ([src/lib/db/index.ts](src/lib/db/index.ts))
- **AI Integration:** Genkit flows ([src/ai/flows/suggest-code-snippets.ts](src/ai/flows/suggest-code-snippets.ts))
- **UI Components:** Custom components ([src/components/ui](src/components/ui))
- **Icons:** Lucide React

## Project Structure

- [`src/app`](src/app): Next.js pages and layouts
- [`src/components`](src/components): UI and feature components
- [`src/data`](src/data): Lab experiment data and types
- [`src/hooks`](src/hooks): Custom React hooks
- [`src/lib`](src/lib): Utilities, actions, and database logic
- [`src/ai`](src/ai): Genkit AI flows and integration
- [`src/contexts`](src/contexts): Context providers (e.g., admin mode)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

## Configuration

- Environment variables are set in `.env` (see `.gitignore` for local env file exclusion).
- Remote images are allowed from `placehold.co` (see [next.config.ts](next.config.ts)).

## License

See [LICENSE](LICENSE) for licensing information.