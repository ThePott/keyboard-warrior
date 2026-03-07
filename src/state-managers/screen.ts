import chalk from "chalk"
import round from "./round.js"
import readline from "readline"

type ChalkStr = {
    ansiText: string
    isCorrect: boolean
}
type Screen = {
    chalkStrArray: ChalkStr[]
    startTime: number | null
    totalKeyStroke: number

    typeCorrectly: (str: string) => void
    typeWrong: (str: string) => void
    backspace: () => void
    makeCleanOutput: () => string
    display: () => void
    countCorrect: () => number
    reset: () => void
    showStatistics: () => number
}
const screen: Screen = {
    chalkStrArray: [],
    totalKeyStroke: 0,
    startTime: null,

    typeCorrectly: (str: string) => {
        const ansiText = chalk.green(str) // correct = green
        screen.chalkStrArray.push({ ansiText, isCorrect: true })
        screen.display()
    },
    typeWrong: (str: string) => {
        const ansiText = chalk.red(str) // wrong = red
        screen.chalkStrArray.push({ ansiText, isCorrect: false })
        screen.display()
    },
    backspace: () => {
        screen.chalkStrArray.pop()
        screen.display()
    },
    makeCleanOutput: () => screen.chalkStrArray.map(({ ansiText }) => ansiText).join(""),
    display: () => {
        console.clear() // NOTE: 매번 지우고 새로 그린다
        console.log(screen.makeCleanOutput() + chalk.gray(round.targetText.slice(screen.chalkStrArray.length)))
        readline.cursorTo(process.stdout, screen.chalkStrArray.length, 0)
    },
    countCorrect: () => screen.chalkStrArray.filter(({ isCorrect }) => isCorrect).length,
    reset: () => {
        screen.chalkStrArray = []
        screen.totalKeyStroke = 0
        screen.startTime = null
        readline.cursorTo(process.stdout, 0, 0)
    },
    showStatistics: () => {
        if (!screen.startTime) throw new Error("시작 시간이 설정되지 않았어요")
        const time = Date.now() - screen.startTime
        const wpm = screen.countCorrect() / 5 / (time / (1000 * 60))
        const accuracy = screen.countCorrect() / screen.totalKeyStroke
        const score = wpm ** accuracy

        const wpmForDisplay = Math.floor(wpm)
        const accuracyForDisplay = Math.floor(accuracy * 100) / 100
        const scoreForDisplay = Math.floor(score)

        console.log("\n")
        const targetScore = round.targetScore
        if (score > targetScore) {
            const resultArray: string[] = []
            resultArray.push(chalk.green(`${wpmForDisplay}**${accuracyForDisplay} = ${scoreForDisplay}`))
            resultArray.push(`> ${targetScore}`)
            console.log(chalk.green("SUCCESS!"))
            console.log(resultArray.join(" "))
        } else {
            const resultArray: string[] = []
            resultArray.push(chalk.red(`${wpmForDisplay}**${accuracyForDisplay} = ${scoreForDisplay}`))
            resultArray.push(`< ${targetScore}`)
            console.log(chalk.red("TRY AGAIN!"))
            console.log(resultArray.join(" "))
        }

        return score
    },
}

export default screen
