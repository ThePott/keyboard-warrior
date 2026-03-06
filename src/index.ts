import chalk from "chalk"
import readline from "readline"
import wordBank from "../data/index.js"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const word = "hello this is something that is long"

// NOTE: 게임 규칙
// NOTE: 새 레벨을 시작하면
// 1. 그 단어만
// 2. 성공하면 그 단어 + 1 - shuffle -> fixed
// 3. 성공하면 위의 것을 shuffle
// 4. 성공하면 그 단어 + 1 - shuffle -> fixed
// 5. 성공하면 위의 것을 shuffle
// ... 반복
// 6. 레벨의 길이에 도달한 것을 성공하면 다음 레벨로 넘어감

type Round = {
    level: number // NOTE: starts from 1
    subLevel: number // NOTE: starts from 1
    isShuffled: boolean
    failedCount: number // NOTE: count가 3이 되면 더 쉽게 만듦. 3 이전에 성공하면 더 어렵게 만듦
    targetText: string // NOTE: 이걸 친다
    targetScore: number // NOTE: 이것의 절반보다 낮으면 sub 시작

    startNextLevel: () => void
    startNextSubLevel: (target?: number) => void
    shuffle: () => void
    startNextRound: (score: number) => void
}
const status: Round = {
    level: 0,
    subLevel: 0,
    isShuffled: false,
    failedCount: 0,
    targetText: "the",
    targetScore: 80,

    startNextLevel: () => {
        status.level++
        status.startNextSubLevel(1)
    },
    startNextSubLevel: (target?: number) => {
        if (!status.isShuffled) {
            status.shuffle()
            return
        }
        status.subLevel = target ?? status.subLevel + 1
        const startIndex = status.level - status.subLevel
        status.targetText = wordBank.slice(startIndex, status.level).join(" ")
        status.failedCount = 0
    },
    shuffle: () => {
        const startIndex = status.level - status.subLevel
        const targetTextArray = wordBank.slice(startIndex, status.level).sort(() => 0.5 - Math.random())
        status.targetText = targetTextArray.join(" ")
        status.isShuffled = true
    },
    startNextRound: (score: number) => {
        if (score > status.targetScore) {
            if (status.level === status.subLevel) {
                status.startNextLevel()
                return
            }
            if (status.isShuffled) {
                status.startNextSubLevel()
                return
            }
            status.shuffle()
            return
        }

        status.failedCount++
        if (score < status.targetScore / 2) {
            if (status.isShuffled) {
                status.isShuffled = false
                status.failedCount = 0 // NOTE: 너무 못하면 이걸로 목표 변경
                return
            }
        }

        if (status.failedCount < 3) {
            if (status.isShuffled) {
                status.shuffle()
                return
            }
            return
        }

        status.subLevel = status.subLevel > 1 ? status.subLevel - 1 : 1
        status.isShuffled = false
    },
}

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
