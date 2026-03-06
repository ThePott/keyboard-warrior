import chalk from "chalk"
import readline from "readline"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const word = "hello this is something that is long"

type ChalkStr = {
    ansiText: string
    isCorrect: boolean
}
type Output = {
    chalkStrArray: ChalkStr[]
    totalKeyStroke: number
    startTime: number | null

    typeCorrectly: (str: string) => void
    typeWrong: (str: string) => void
    backspace: () => void
    makeCleanOutput: () => string
    display: () => void
    countCorrect: () => number
    showStatistics: () => void
}
const output: Output = {
    chalkStrArray: [],
    totalKeyStroke: 0,
    startTime: null,

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
        readline.cursorTo(process.stdout, output.chalkStrArray.length, 0)
    },
    countCorrect: () => output.chalkStrArray.filter(({ isCorrect }) => isCorrect).length,
    showStatistics: () => {
        if (!output.startTime) throw new Error("시작 시간이 설정되지 않았어요")
        const time = Date.now() - output.startTime
        const wpm = output.countCorrect() / 5 / (time / (1000 * 60))
        const accuracy = output.countCorrect() / output.totalKeyStroke
        const score = wpm ** accuracy

        const timeForDisplay = Math.round(time / 1000)
        const wpmForDisplay = Math.round(wpm)
        const accuracyForDisplay = Math.round(accuracy)
        const scoreForDisplay = Math.round(score)
        console.log({ timeForDisplay, wpmForDisplay, accuracyForDisplay, scoreForDisplay })
    },
}

output.display()

process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()

    if (output.startTime === null) {
        output.startTime = Date.now()
    }

    output.totalKeyStroke++

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
        output.showStatistics()
        process.exit()
    }
})
