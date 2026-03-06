import chalk from "chalk"
import readline from "readline"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const word = "hello"

type ChalkStr = {
    ansiText: string
    isCorrect: boolean
}
type Output = {
    chalkStrArray: ChalkStr[]

    typeCorrectly: (str: string) => void
    typeWrong: (str: string) => void
    backspace: () => void
    makeCleanOutput: () => string
    display: () => void
    countCorrect: () => number
}
const output: Output = {
    chalkStrArray: [],
    typeCorrectly: (str: string) => {
        const ansiText = chalk.green(str) // correct = green
        output.chalkStrArray.push({ ansiText, isCorrect: true })
        output.display()
    },
    typeWrong: (str: string) => {
        const ansiText = chalk.red(str) // wrong = red
        output.chalkStrArray.push({ ansiText, isCorrect: false })
        output.display()
    },
    backspace: () => {
        output.chalkStrArray.pop()
        output.display()
    },
    makeCleanOutput: () => output.chalkStrArray.map(({ ansiText }) => ansiText).join(""),
    display: () => {
        console.clear() // NOTE: 매번 지우고 새로 그린다
        console.log(output.makeCleanOutput() + chalk.gray(word.slice(output.chalkStrArray.length)))
    },
    countCorrect: () => output.chalkStrArray.filter(({ isCorrect }) => isCorrect).length,
}

console.clear()
console.log(chalk.gray(word))

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()
    console.log({ name: key.name })
    if (key.name === "backspace") {
        output.backspace()
        return
    }

    const expected = word[output.chalkStrArray.length]
    if (str === expected) {
        output.typeCorrectly(str)
    } else {
        output.typeWrong(str)
    }

    if (output.countCorrect() >= word.length) {
        console.log("\nDone!")
        process.exit()
    }
})
