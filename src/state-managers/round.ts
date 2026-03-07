import wordBank from "../data/index.js"
import screen from "./screen.js"

// TODO: 단순화하자. sublevel, shuffle 없애고 level 올라갈 때마다 endIndex 올리자
// TODO: 통계를 이용하는 건 round 이니까 round에서 통계 관련 속성을 가지고 있는 게 자연스럽겠다
type Round = {
    endIndex: number // NOTE: starts from 1
    startIndex: number // TODO: 지금은 0으로 고정하고 subLevel은 나중에 구현하자
    targetText: string // NOTE: 이걸 친다
    targetScore: number // NOTE: 이것의 절반보다 낮으면 sub 시작

    startRound: (endIndexDiff: number) => void
    handleRoundResult: (score: number) => void
}
const round: Round = {
    endIndex: 1,
    startIndex: 0,
    targetText: wordBank[0] ?? "the",
    targetScore: 80,

    startRound: (endIndexDiff: number) => {
        screen.startTime = Date.now()
        round.endIndex += endIndexDiff
        round.targetText = wordBank
            .slice(round.startIndex, round.endIndex)
            .sort(() => -1)
            .join(" ")
        screen.reset()
        screen.display()
    },
    handleRoundResult: (score: number) => {
        if (score > round.targetScore) {
            // NOTE: 다음 라운드 시작
            round.startRound(1)
            return
        }
        // NOTE: 지금 라운드 반복
        round.startRound(0)
    },
}

export default round
