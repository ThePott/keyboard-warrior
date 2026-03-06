import chalk from "chalk"
import readline from "readline"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const word = "hello"

type Output = {
    ansiTextArray: string[]

    typeCorrectly: (str: string) => void
    typeWrong: (str: string) => void
    backspace: () => void
    makeCleanOutput: () => string
}
const output: Output = {
    ansiTextArray: [],
    typeCorrectly: (str: string) => {
        const ansiText = chalk.green(str) // correct = green
        output.ansiTextArray.push(ansiText)
    },
    typeWrong: (str: string) => {
        const ansiText = chalk.red(str) // wrong = red
        output.ansiTextArray.push(ansiText)
    },
    backspace: () => {
        output.ansiTextArray.pop()
    },
    makeCleanOutput: () => output.ansiTextArray.join(""),
}

console.clear()
console.log(chalk.gray(word))

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()
    if (key.name === "backspace") {
        output.backspace()
        return
    }

    const expected = word[output.ansiTextArray.length]
    if (str === expected) {
        output.typeCorrectly(str)
    } else {
        output.typeWrong(str)
    }

    console.clear() // NOTE: 매번 지우고 새로 그린다
    console.log(output.makeCleanOutput() + chalk.gray(word.slice(output.ansiTextArray.length)))

    // NOTE: 틀리면 완료 안 시켜야
    // TODO: 그걸 어떻게 감지하지?
    if (output.ansiTextArray.length >= word.length) {
        console.log("\nDone!")
        process.exit()
    }
})
