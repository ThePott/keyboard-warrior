# AGENTS.md - Guidelines for AI Coding Agents

This document provides essential information for AI coding agents working in this repository.

## Project Overview

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js
- **Module System:** ESM with NodeNext resolution
- **Source Directory:** `./src`
- **Output Directory:** `./dist`

## Build Commands

```bash
# Compile TypeScript to JavaScript
npx tsc

# Compile with watch mode
npx tsc --watch

# Type-check without emitting files
npx tsc --noEmit
```

## Testing

**No test framework is currently configured.** When adding tests:

```bash
# Recommended: Install vitest for testing
npm install -D vitest

# Run all tests (once configured)
npx vitest run

# Run a single test file
npx vitest run path/to/file.test.ts

# Run tests matching a pattern
npx vitest run -t "test name pattern"

# Watch mode
npx vitest
```

## Linting and Formatting

**No linter is currently configured.** When adding:

```bash
# Recommended: Install ESLint and Prettier
npm install -D eslint prettier eslint-config-prettier

# Run lint (once configured)
npx eslint src/

# Format code (once configured)
npx prettier --write src/
```

## TypeScript Configuration

This project uses **strict TypeScript settings**. Key compiler options:

| Option                       | Value  | Impact                                                 |
| ---------------------------- | ------ | ------------------------------------------------------ |
| `strict`                     | `true` | Enables all strict type-checking options               |
| `noUncheckedIndexedAccess`   | `true` | Array/object index access returns `T \| undefined`     |
| `exactOptionalPropertyTypes` | `true` | Distinguish between `undefined` and missing properties |
| `verbatimModuleSyntax`       | `true` | Must use `import type` for type-only imports           |
| `isolatedModules`            | `true` | Each file must be independently transpilable           |

## Code Style Guidelines

### Imports

```typescript
// Use 'import type' for type-only imports (required by verbatimModuleSyntax)
import type { SomeType, AnotherType } from "./types.js"

// Regular imports for values
import { someFunction } from "./utils.js"

// Always include .js extension for local imports (NodeNext resolution)
import { helper } from "./helpers/index.js"

// Group imports in order:
// 1. Node.js built-ins
// 2. External packages
// 3. Internal modules (relative imports)
import { readFile } from "node:fs/promises"
import express from "express"
import { myUtil } from "./utils.js"
```

### Functions

```typescript
// ALWAYS use arrow functions by default
const getUserById = (id: string): User | undefined => {
    // implementation
}

const processItems = async (items: Item[]): Promise<void> => {
    // implementation
}

// ONLY use function keyword for overloaded functions
function parseInput(input: string): string
function parseInput(input: number): number
function parseInput(input: string | number): string | number {
    return typeof input === "string" ? input.trim() : input * 2
}
```

### Naming Conventions

```typescript
// Files: kebab-case
// my-component.ts, user-service.ts, api-handler.ts

// Variables and functions: camelCase
const userName = "John"
const getUserById = (id: string): User | undefined => {
    /* ... */
}

// Classes and types: PascalCase
class UserService {
    /* ... */
}
type UserConfig = {
    /* ... */
}
type ResponseData = {
    /* ... */
}

// Constants: SCREAMING_SNAKE_CASE (for true constants)
const MAX_RETRY_COUNT = 3
const API_BASE_URL = "https://api.example.com"

// Enums: PascalCase for name, PascalCase for members
enum UserRole {
    Admin = "admin",
    User = "user",
    Guest = "guest",
}

// Boolean variables: use is/has/should/can prefix
const isLoading = true
const hasPermission = false
const shouldRetry = true
```

### Types

```typescript
// ALWAYS use 'type' by default for all type definitions
type User = {
    id: string
    name: string
    email: string
}

type UserId = string
type Status = "pending" | "active" | "inactive"
type UserWithRole = User & { role: UserRole }

// ONLY use 'interface' for declaration merging or extending third-party types
// Example: Extending Express Request
interface Request {
    user?: User
}

// Example: Module augmentation
declare module "express" {
    interface Request {
        customField: string
    }
}

// Always annotate function return types for public APIs
const createUser = (name: string): User => {
    return { id: crypto.randomUUID(), name, email: "" }
}

// Handle undefined from indexed access (noUncheckedIndexedAccess)
const users: User[] = []
const firstUser = users[0] // Type: User | undefined
if (firstUser) {
    console.log(firstUser.name) // Safe access after narrowing
}

// Use 'unknown' instead of 'any' for truly unknown types
const parseJson = (input: string): unknown => {
    return JSON.parse(input)
}
```

### Error Handling

```typescript
// Use custom error classes for domain-specific errors
class ValidationError extends Error {
    constructor(
        message: string,
        public field: string,
    ) {
        super(message)
        this.name = "ValidationError"
    }
}

// Type-narrow caught errors (they are 'unknown' in strict mode)
try {
    await riskyOperation()
} catch (error) {
    if (error instanceof ValidationError) {
        console.error(`Validation failed on ${error.field}: ${error.message}`)
    } else if (error instanceof Error) {
        console.error(`Error: ${error.message}`)
    } else {
        console.error("Unknown error:", error)
    }
}

// Prefer returning Result types over throwing for expected failures
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

const parseConfig = (input: string): Result<Config, ValidationError> => {
    // ... validation logic
}
```

### Async/Await

```typescript
// Always use async/await over raw Promises
const fetchUser = async (id: string): Promise<User> => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
    }
    return response.json()
}

// Handle multiple concurrent operations with Promise.all
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])
```

### Comments and Documentation

```typescript
// Use JSDoc for public APIs
/**
 * Creates a new user in the system.
 * @param name - The display name for the user
 * @param email - The user's email address
 * @returns The newly created user object
 * @throws {ValidationError} If the email format is invalid
 */
const createUser = (name: string, email: string): User => {
    // Implementation
}

// Use inline comments sparingly, prefer self-documenting code
// Explain "why", not "what"
```

## File Structure

```
keyboard-warrior/
├── src/              # Source code
│   └── index.ts      # Main entry point
├── dist/             # Compiled output (git-ignored)
├── node_modules/     # Dependencies (git-ignored)
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
├── .gitignore        # Git ignore rules
└── AGENTS.md         # This file
```

## Common Pitfalls

1. **Missing `.js` extension**: Always use `.js` extension in imports, even for `.ts` files
2. **Forgetting `import type`**: Use `import type` for type-only imports
3. **Unchecked index access**: Always handle potential `undefined` from array/object access
4. **Optional property assignment**: Cannot assign `undefined` to optional properties; omit the property instead

## Environment Variables

Store sensitive configuration in `.env` file (git-ignored). Use a validation library or manual checks to ensure required
variables are present.

```typescript
const requiredEnv = ["DATABASE_URL", "API_KEY"] as const
for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
}
```

## question.md / answer.md

When working with `question.md` and `answer.md`:

- **Only edit `answer.md`** — never modify `question.md`
- Read the question, then write your answer in the answer file
