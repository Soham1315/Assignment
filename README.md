# School Assignment

Requirements: Node 18+, MySQL 8+.

1. Copy `.env.example` to `.env` and fill your MySQL credentials.
2. Create database/table by importing `schema.sql` or let the app create the table automatically on first API call.
3. Install and run:
```
npm install
npm run dev
```
Open http://localhost:3000

Build and start:
```
npm run build
npm start
```

Notes:
- Images are saved under `public/schoolImages` and served from `/schoolImages/...`.
- On serverless hosts with ephemeral storage, use a persistent file store instead of local disk.