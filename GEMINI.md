# Project Overview

This is a data-driven running platform that helps users connect their Strava account to track performance, prevent injuries, and optimize training. It's built with Next.js 14+ and the Strava API.

The main philosophy behind this project is to empower all runners with data-driven training and injury prevention, moving away from relying on subjective feelings. The target user is any runner with a Strava account who wants a deeper understanding of their training data.

## Key Features

-   **Strava OAuth Integration**: Securely connect your Strava account to import and analyze your running data.
-   **Real-time Training Metrics**: Tracks weekly mileage, training load, and performance.
-   **Injury Prevention**: Monitors the Acute:Chronic Workload Ratio (ACWR).
-   **Performance Analysis**: Provides VDOT-based training paces and race predictions.
-   **Dynamic Training Planner**: Create, visualize, and manage your own training schedule.
-   **Individualized Dashboard**: A personalized dashboard for every user.

## Building and Running the Project

### Prerequisites

-   Node.js 18 or higher
-   **Package Manager**: `pnpm` (Chosen for efficient disk usage via content-addressable storage, faster installation speeds, and strict dependency management to prevent phantom dependencies.)
-   A Strava developer account
-   A database (e.g., PostgreSQL, MySQL, or SQLite for development)

### Setup and Execution

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Set up environment variables**: Create a `.env.local` file. The `STRAVA_REFRESH_TOKEN` is no longer needed for the multi-user setup. You will also need to add your database connection string.
    ```env
    STRAVA_CLIENT_ID=your_client_id
    STRAVA_CLIENT_SECRET=your_client_secret
    DATABASE_URL=your_database_connection_string
    NEXTAUTH_SECRET=a_random_secret_string_for_session_encryption
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:3000`.

### Other Commands

-   **Build for production**:
    ```bash
    npm run build
    ```
-   **Start the production server**:
    ```bash
    npm run start
    ```
-   **Run the linter**:
    ```bash
    npm run lint
    ```

## Development Conventions

### Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Authentication**: Supabase Auth
-   **Database**: Supabase (PostgreSQL)
-   **Styling**: Tailwind CSS, Radix UI, shadcn/ui
-   **Data Fetching & Caching**: TanStack Query v5 (React Query)
-   **State Management**: Zustand
-   **Data Grid**: AG Grid (Community Edition)
-   **Visualization**: Recharts
-   **Deployment**: Vercel
-   **Data Source**: Strava API v3

### Project Structure

The project follows a standard Next.js App Router structure:

-   `app/`: Contains the application's pages and API routes.
-   `components/`: Contains reusable UI components.
-   `lib/`: Contains the core logic, utilities, and API interactions.
-   `utils/`: Contains Supabase client setup.
-   `public/`: Contains static assets.

### Authentication

The application uses **Supabase Auth** to handle Strava OAuth authentication.

1.  **User Login**: A new user clicks a "Connect with Strava" button.
2.  **Authorization**: The user is redirected to Strava via Supabase Auth.
3.  **Callback**: After authorization, Strava redirects back, and Supabase handles session creation.
4.  **Token Management**: Supabase manages the session tokens. Strava `access_token` and `refresh_token` are stored securely by Supabase.

## Development Roadmap

### Phase 1: Foundation & Authentication

-   [ ] **Project Setup**: Replace Prisma/NextAuth with Supabase client setup (`@supabase/supabase-js`, `@supabase/ssr`).
-   [ ] **Supabase Config**: Configure Strava Provider in Supabase Dashboard.
-   [ ] **Create Login Flow**: Build the UI for users to sign in using Supabase Auth.
-   [ ] **Data Sync Service**: Develop a service to fetch user's Strava data using the tokens stored in Supabase.

### Phase 2: Core Features & Dynamic Planning

-   [ ] **Adapt Analytics**: Refactor existing analytics logic (`VDOT`, `ACWR`) to work with data from the database for the logged-in user.
-   [ ] **Build Dynamic Scheduler UI**: Create an interactive calendar interface where users can add, edit, and delete planned workouts.
-   [ ] **Scheduler Backend**: Implement API routes to handle CRUD operations for training plans, storing them in the database.
-   [ ] **"Plan vs. Actual" Logic**: On the calendar, visually distinguish between planned workouts, completed workouts (from Strava), and missed workouts.

### Phase 3: Advanced Insights & UX Polish

-   [ ] **Expand Metrics**: Introduce more advanced running metrics (e.g., TRIMP, training load balance).
-   [ ] **Historical Analysis**: Create new charts and views for users to analyze their long-term progress and trends.
-   [ ] **Refine UI/UX**: Improve dashboard layout, component design, and overall user experience based on the new features.
-   [ ] **Add Onboarding**: Create a simple onboarding flow for new users to explain the key features.
### Testing

-   Implement unit and integration tests for critical components and logic.

## Development Workflow

This project follows a systematic development workflow managed within the `.gemini/` directory. Every significant feature or change must follow this sequence:

1.  **PRD (Product Requirements Document)**: Define "What" and "Why" in `.gemini/prds/`. Focus on user value and functional requirements.
2.  **Spec (Technical Specification)**: Define "How" in `.gemini/specs/`. Detail data models, API interfaces, and architectural decisions.
3.  **Plan (Implementation Plan)**: Break down the work into actionable steps in `.gemini/plans/`. Define the sequence of tasks and feature breakdown.
4.  **Implementation**: Execute the tasks based on the plan, followed by verification (tests and standards).
    -   **Atomic Commits**: After completing each individual task (as defined in the Plan), the agent must propose a git commit to the user.

All tools and custom commands used during development are documented in `.gemini/commands/`.

