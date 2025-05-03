# Live Voting App

A modern, real-time voting application built with React Native (Expo) and Convex backend. This app allows users to create and participate in live voting sessions with features like anonymous voting, real-time updates, and group management.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Voting Management**:
  - Create, edit, and delete voting suggestions
  - Set voting goals and track progress
  - Private and public voting options
  - Real-time vote counting
- **Group Organization**:
  - Create and manage voting groups
  - Invite users to groups
  - Set group permissions and visibility
- **Comment System**:
  - Anonymous commenting on suggestions
  - Real-time comment updates
  - Comment moderation
- **User Profile**: View and manage your profile information
- **Responsive UI**: Beautiful and intuitive interface with animations
- **Real-time Updates**: Changes sync instantly across devices

## Screenshots

<!-- Add your screenshots here from assets/screenshots directory -->

| Home Screen                            | Add Task Screen                                | Task Details                                           |
| -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| ![Home](./assets/screenshots/home.png) | ![Add Task](./assets/screenshots/add_task.png) | ![Task Details](./assets/screenshots/task_details.png) |

## Tech Stack

### Frontend

- **React Native** with **Expo** - Mobile app framework
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation system
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **React Native Reanimated** - Animations
- **Shopify Restyle** - Styling system
- **date-fns** - Date utility library

### Backend

- **Convex** - Backend-as-a-service for real-time data
- **Clerk** - Authentication and user management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or Bun package manager
- Expo CLI

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd live_voting_app
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Available Scripts

- `npm run android` or `bun run android` - Run the app on an Android device/emulator
- `npm run ios` or `bun run ios` - Run the app on an iOS simulator
- `npm run update:app` - Update the app with EAS Update
- `npm run publish:android` - Build Android app for preview
- `npm run lint` - Lint the code
- `npm run format` - Format the code with ESLint and Prettier

## Development

The project follows a structured architecture:

- `app/` - Main application routes
  - `(auth)/` - Authentication screens
  - `(main)/` - Main app screens
    - `(tabs)/` - Tab navigation screens
- `components/` - Reusable UI components
- `styles/` - Styling configuration
- `types/` - TypeScript type definitions
- `convex/` - Backend API and schema definitions
- `theme/` - Shopify Restyle theme configuration

## Lessons Learned

- Building a real-time voting system with Convex backend
- Implementing anonymous commenting and voting features
- Managing group permissions and visibility
- Creating responsive UI with Shopify Restyle

## License

[MIT License](LICENSE)
