import readline from "readline"
import round from "./state-managers/round.js"
import screen from "./state-managers/screen.js"

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

// NOTE: 게임 규칙
// NOTE: 새 레벨을 시작하면
// 1. 그 단어만
// 2. 성공하면 그 단어 + 1 - shuffle -> fixed
// 3. 성공하면 위의 것을 shuffle
// 4. 성공하면 그 단어 + 1 - shuffle -> fixed
// 5. 성공하면 위의 것을 shuffle
// ... 반복
// 6. 레벨의 길이에 도달한 것을 성공하면 다음 레벨로 넘어감

screen.display()
let score: number = 0
process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") process.exit()
    if (key.name === "return") {
        round.handleRoundResult(score)
        return
    }

    if (screen.startTime === null) {
        screen.startTime = Date.now()
    }

    screen.totalKeyStroke++

    if (key.name === "backspace") {
        screen.backspace()
        return
    }

    const expected = round.targetText[screen.chalkStrArray.length]
    if (str === expected) {
        screen.typeCorrectly(str)
    } else {
        screen.typeWrong(str)
    }

    if (screen.countCorrect() >= round.targetText.length) {
        score = screen.showStatistics()
    }
})
