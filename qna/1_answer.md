# Answer: MVP of the MVP for Terminal Typing Game

## The Absolute Minimum Starting Point

The MVP of the MVP is: **Display a single word in dim color, capture keystrokes, and change character colors based on correctness.**

That's it. No timers, no WPM calculation, no multiple words - just one word.

## Step-by-Step Breakdown

### Step 1: Display dim text (5 lines)

```typescript
import chalk from "chalk"

const word = "hello"
console.log(chalk.gray(word))
```

### Step 2: Capture raw keystrokes (10 lines)

```typescript
import readline from "readline"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()
    console.log(`You pressed: ${str}`)
})
```

### Step 3: Color characters based on correctness (MVP complete)

```typescript
import chalk from "chalk"
import readline from "readline"

const word = "hello"
let index = 0
let output = ""

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()

    const expected = word[index]
    if (str === expected) {
        output += chalk.green(str) // correct = green
    } else {
        output += chalk.red(expected) // wrong = red
    }
    index++

    console.clear()
    console.log(output + chalk.gray(word.slice(index)))

    if (index >= word.length) {
        console.log("\nDone!")
        process.exit()
    }
})
```

## Why This is the MVP of the MVP

Looking at monk-minal's `game.js`, the core loop does these things:

1. `process.stdin.on('keypress', ...)` - captures input
2. Compares `str === text[index]` - checks correctness
3. Uses chalk to color: `{green ${currentInput}}{bgRedBright ${errorString}}{gray ${text.slice(index)}}`
4. `console.clear()` + `console.log()` - re-renders

Everything else (WPM, timer, word generation, centering, backspace handling) is added complexity.

## Recommended Order of Implementation

1. **MVP** (above) - single word, green/red coloring
2. Add multiple words (hardcoded array)
3. Add backspace support
4. Add "overflow" red text for extra wrong characters
5. Add timer display
6. Add WPM calculation
7. Add your custom game logic (decreasing words based on speed)

## Key Dependencies

```bash
npm install chalk
```

That's the only dependency you need to start. The `readline` module is built into Node.js.
