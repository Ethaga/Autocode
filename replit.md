# Code Analysis Tool

## Overview

This is a modern web-based code analysis tool that provides security scanning, bug detection, and code quality analysis for multiple programming languages. The application features a React frontend with a clean, responsive interface built using shadcn/ui components, and an Express.js backend that processes code analysis requests. The tool supports JavaScript, Python, and Solidity code analysis with real-time results display and analysis history tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Code Analysis**: Custom analyzer service with language-specific parsing for JavaScript, Python, and Solidity
- **File Upload**: Multer middleware for handling code file uploads with size and type validation
- **Data Storage**: In-memory storage implementation with seeded demo data (ready for database integration)
- **API Design**: RESTful endpoints for analysis operations, statistics, and recent analysis retrieval

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema**: Code analyses table with JSON storage for analysis results and metadata
- **Migration System**: Drizzle Kit for database schema migrations and management
- **Connection**: Neon Database serverless PostgreSQL integration

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: CORS enabled, JSON parsing with size limits, and file type validation
- No authentication system currently implemented (designed for extension)

### External Dependencies
- **Database**: PostgreSQL (Neon Database serverless)
- **UI Library**: Radix UI primitives for accessible components
- **Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting
- **Development**: Vite with React plugin and runtime error overlay for development experience
- **Build System**: esbuild for server-side bundling and Vite for client-side builds