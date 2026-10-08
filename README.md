# BroAI

BroAI is a full-stack AI workspace with three user-facing modes:

- **Programista** — coding workspace with files, editor, diff, console and AI task routing.
- **Gadanie** — conversational chat with memory and profile preferences.
- **Nauka** — tutor, quizzes and progress tracking foundations.
- **Obrazy** — generowanie obrazów przez osobny endpoint.

Nano Banana is intentionally **not integrated** into this codebase. It remains a separate PFP generator.

## Stack

This starter uses Next.js 16.4, React 19.3, TypeScript, PostgreSQL + Prisma ORM 7, and Lucide React. The current official Next.js release is 16.4, and Prisma's current stable 7.x documentation uses `prisma-client` with `@prisma/adapter-pg`.

## Requirements

Node.js 20.19+ is required by current Prisma 7 guidance; Node 22.12+ is also supported. PostgreSQL is required for the current schema.

## Setup

```bash
npm install
cp .env.example .env
