# FlowForge

A full-stack chatbot flow builder application that allows users to create visual chatbot workflows using a drag-and-drop interface. Built with React Flow, shadcn/ui components, and PostgreSQL.

## Requirements

- Node.js 18 or higher
- PostgreSQL database
- Environment variables set up in `.env` file

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
HOST=0.0.0.0
RENDER_DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run db:generate` - Generate database schema from Drizzle ORM models
- `npm run db:push` - Push the current schema to the database
- `npm run db:migrate` - Run database migrations
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

## Key Features

- Visual drag-and-drop flow builder interface
- Real-time node editing and configuration
- PostgreSQL database for flow persistence
- Modern React components with shadcn/ui
- Full TypeScript support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Hot reload with Vite middleware

## Database Tables

- `flows`: Flow metadata (name, nodes, edges, timestamps)
- `flow_nodes`: Node data with position and configuration
- `users`: User authentication (for future implementation)