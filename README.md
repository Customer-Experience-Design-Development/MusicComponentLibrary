# Music Component Library

A comprehensive library of React components for music applications.

## Server Configuration

This application supports both local development and deployment on Replit:

### Environment Setup

The server is configured to run on different ports depending on the environment:

- **Replit**: Uses port 5000 by default (required by Replit)
- **Local Development**: Uses port 3000 by default to avoid conflicts

### Running the Application

#### Local Development

To run the application locally on port 3000:

```bash
npm run local-dev
```

This will start the server on port 3000 using the updated configuration.

#### Replit Development

To run the application on Replit:

```bash
npm run dev
```

This will use the Replit environment settings and run on port 5000.

### Configuration Details

The port selection logic in `server/index.ts` detects the running environment:

```typescript
const isReplit = process.env.REPL_ID !== undefined;
const defaultPort = isReplit ? 5000 : 3000;
const port = parseInt(process.env.PORT || String(defaultPort), 10);
```

You can also override the port by setting the `PORT` environment variable. 