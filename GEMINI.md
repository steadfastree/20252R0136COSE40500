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
-   A package manager like npm, yarn, pnpm, or bun
-   A Strava developer account
-   A database (e.g., PostgreSQL, MySQL, or SQLite for development)

### Setup and Execution

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    npm install
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
-   **Authentication**: NextAuth.js
-   **Database ORM**: Prisma or Drizzle
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Data Fetching**: SWR or React Query
-   **Visualization**: Recharts
-   **Deployment**: Vercel
-   **Data Source**: Strava API v3

### Project Structure

The project follows a standard Next.js App Router structure:

-   `app/`: Contains the application's pages and API routes.
-   `components/`: Contains reusable UI components.
-   `lib/`: Contains the core logic, utilities, and API interactions.
-   `prisma/` or `db/`: Contains database schema and migration files.
-   `public/`: Contains static assets.

### Authentication

The application will use a standard multi-user OAuth 2.0 flow with NextAuth.js to handle Strava authentication.

1.  **User Login**: A new user clicks a "Connect with Strava" button.
2.  **Authorization**: The user is redirected to Strava to authorize the application.
3.  **Callback**: After authorization, Strava redirects the user back to the application with an authorization code.
4.  **Token Exchange**: The application server exchanges the code for an `access_token` and a `refresh_token`.
5.  **Session & Storage**: The user's profile and tokens are securely stored in the database. A session is created for the user. The `refresh_token` will be used to obtain new `access_token`s in the background.

## Development Roadmap

### Phase 1: Foundation & Multi-User Authentication

-   [ ] **Project Setup**: Integrate Prisma/Drizzle ORM and set up the database schema for Users, Accounts, and Activities.
-   [ ] **Implement NextAuth.js**: Configure the Strava Provider for OAuth 2.0 authentication.
-   [ ] **Create Login Flow**: Build the UI for users to sign in and connect their Strava account.
-   [ ] **Data Sync Service**: Develop a robust service to fetch and store a user's historical Strava data upon their first login.
-   [ ] **Token Management**: Ensure the Strava `refresh_token` is used correctly to keep the `access_token` fresh for API calls.

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
-   [ ] **Testing**: Implement unit and integration tests for critical components and logic.
