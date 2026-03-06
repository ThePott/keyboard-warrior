# Answer: Implementing End-of-Game Statistics

## What You Need to Track

For basic typing statistics, you need:

1. **Start time** - when typing began
2. **End time** - when typing finished
3. **Correct characters** - you already have this via `countCorrect()`
4. **Total characters typed** - total keystrokes (including wrong ones)

## Minimal Implementation

```typescript
// Add at top level
let startTime: number | null = null
let totalKeystrokes = 0

// In keypress handler, before processing:
if (startTime === null) {
    startTime = Date.now()
}
totalKeystrokes++

// At game end:
const endTime = Date.now()
const timeInSeconds = (endTime - startTime!) / 1000
const correctChars = output.countCorrect()

// Calculate stats
const accuracy = (correctChars / totalKeystrokes) * 100
const wpm = (correctChars / 5) / (timeInSeconds / 60)  // standard: 5 chars = 1 word

console.log(`
Time: ${timeInSeconds.toFixed(1)}s
Accuracy: ${accuracy.toFixed(1)}%
WPM: ${wpm.toFixed(0)}
`)
```

## Full Integration with Your Code

```typescript
import chalk from "chalk"
import readline from "readline"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const word = "hello this is something that is long"

// Statistics tracking
let startTime: number | null = null
let totalKeystrokes = 0

type ChalkStr = {
    ansiText: string
    isCorrect: boolean
}

// ... your existing output object ...

const showStats = () => {
    if (startTime === null) return

    const timeInSeconds = (Date.now() - startTime) / 1000
    const correctChars = output.countCorrect()
    const accuracy = totalKeystrokes > 0 ? (correctChars / totalKeystrokes) * 100 : 0
    const wpm = (correctChars / 5) / (timeInSeconds / 60)

    console.clear()
    console.log(chalk.cyan("=== Results ==="))
    console.log(`Time:     ${timeInSeconds.toFixed(1)}s`)
    console.log(`Accuracy: ${accuracy.toFixed(1)}%`)
    console.log(`WPM:      ${wpm.toFixed(0)}`)
    console.log(`Correct:  ${correctChars}/${word.length} characters`)
}

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()

    // Start timer on first keypress
    if (startTime === null) {
        startTime = Date.now()
    }

    if (key.name === "backspace") {
        output.backspace()
        return
    }

    totalKeystrokes++  // Count every non-backspace keystroke

    const expected = word[output.chalkStrArray.length]
    if (str === expected) {
        output.typeCorrectly(str)
    } else {
        output.typeWrong(str)
    }

    if (output.countCorrect() >= word.length) {
        showStats()
        process.exit()
    }
})
```

## WPM Formula Explained

```
WPM = (characters / 5) / (time in minutes)
```

- **5 characters = 1 "standard word"** (industry standard)
- Use **correct characters only** for accurate WPM (this is "Net WPM")
- Use **total characters** for "Gross WPM"

## Optional: Gross vs Net WPM

```typescript
const grossWpm = (totalKeystrokes / 5) / (timeInSeconds / 60)
const netWpm = (correctChars / 5) / (timeInSeconds / 60)
// or: netWpm = grossWpm - (errors / timeInMinutes)
```

## Summary

| Stat | Formula |
|------|---------|
| Time | `(endTime - startTime) / 1000` |
| Accuracy | `(correctChars / totalKeystrokes) * 100` |
| WPM | `(correctChars / 5) / (timeInSeconds / 60)` |

You already track correctness per character in `chalkStrArray`. Just add `startTime` and `totalKeystrokes` to calculate everything at the end.
