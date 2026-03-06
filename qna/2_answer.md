# Answer: Cursor Positioning in Terminal Typing Practice

## Why the cursor is at bottom-left

`console.log()` always adds a newline (`\n`) at the end. So the cursor moves to the next line after printing.

```typescript
console.log("hello")  // prints "hello\n", cursor goes to next line
```

## Solution 1: Use `process.stdout.write()` (no newline)

```typescript
console.clear()
process.stdout.write(output.makeCleanOutput() + chalk.gray(word.slice(output.chalkStrArray.length)))
```

This keeps the cursor right after the last character. No newline = cursor stays inline.

## Solution 2: Use `readline.cursorTo()` for precise positioning

```typescript
import readline from "readline"

// After printing, move cursor to specific position
console.clear()
console.log(output.makeCleanOutput() + chalk.gray(word.slice(output.chalkStrArray.length)))

// Move cursor to row 0, column = number of typed characters
readline.cursorTo(process.stdout, output.chalkStrArray.length, 0)
```

## Solution 3: Hide the cursor entirely (like monk-minal)

Most typing practice apps hide the cursor and just use color to show position:

```typescript
import cliCursor from "cli-cursor"

// At game start
cliCursor.hide()

// At game end
cliCursor.show()
```

Install with: `npm install cli-cursor`

The "cursor" is implied by the boundary between colored (typed) and gray (untyped) text.

## Recommended Approach for Your App

Combine solutions 1 and 3:

```typescript
import cliCursor from "cli-cursor"

// Hide cursor at start
cliCursor.hide()

// In display(), use write() instead of log()
display: () => {
    console.clear()
    process.stdout.write(
        output.makeCleanOutput() + chalk.gray(word.slice(output.chalkStrArray.length))
    )
}

// Show cursor on exit
process.on("exit", () => cliCursor.show())
```

## ANSI Escape Codes (low-level alternative)

If you don't want dependencies, you can use raw ANSI codes:

```typescript
// Hide cursor
process.stdout.write("\x1B[?25l")

// Show cursor
process.stdout.write("\x1B[?25h")

// Move cursor to x=5, y=0
process.stdout.write("\x1B[0;5H")
```

## Summary

| Method | Use case |
|--------|----------|
| `process.stdout.write()` | Keep cursor inline after text |
| `readline.cursorTo(stdout, x, y)` | Move cursor to exact position |
| `cliCursor.hide()` | Hide cursor entirely (cleanest look) |
| ANSI `\x1B[?25l` | Hide cursor without dependency |
