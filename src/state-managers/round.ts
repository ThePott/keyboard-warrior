import wordBank from "../data/index.js"
import screen from "./screen.js"

// TODO: 단순화하자. sublevel, shuffle 없애고 level 올라갈 때마다 endIndex 올리자
// TODO: 통계를 이용하는 건 round 이니까 round에서 통계 관련 속성을 가지고 있는 게 자연스럽겠다
type StartRoundProps = {
    length: number
    endIndexDiff: number
}
type Round = {
    endIndex: number // NOTE: starts from 1
    startIndex: number // TODO: 지금은 0으로 고정하고 subLevel은 나중에 구현하자
    targetText: string // NOTE: 이걸 친다
    targetScore: number // NOTE: 이것의 절반보다 낮으면 sub 시작

    startRound: ({ length, endIndexDiff }: StartRoundProps) => void
    handleRoundResult: (score: number) => void
}
const round: Round = {
    endIndex: 1,
    startIndex: 0,
    targetText: wordBank[0] ?? "the",
    targetScore: 60,

    startRound: ({ length, endIndexDiff }: StartRoundProps) => {
        screen.startTime = Date.now()
        round.endIndex += endIndexDiff

        const startIndex = round.endIndex - length
        round.startIndex = Math.min(Math.max(0, startIndex), round.endIndex - 1)
        round.targetText = wordBank
            .slice(round.startIndex, round.endIndex)
            .sort(() => -1)
            .join(" ")
        screen.reset()
        screen.display()
    },
    handleRoundResult: (score: number) => {
        const length = round.endIndex - round.startIndex
        if (score > round.targetScore) {
            // NOTE: 다 잘했으면 다음으로
            if (round.startIndex <= 0) {
                round.startRound({ length: 1, endIndexDiff: 1 })
                return
            }
            // NOTE: 복습 잘했으면 복습 단어 추가
            round.startRound({ length: length + 1, endIndexDiff: 0 })
            return
        }

        // NOTE: 아주 못하면 개수 하나 줄여 재시도
        if (score < round.targetScore / 2) {
            round.startRound({ length: length - 1, endIndexDiff: 0 })
            return
        }

        // NOTE: 적당히 못하면 반복
        round.startRound({ length, endIndexDiff: 0 })
    },
}

export default round
