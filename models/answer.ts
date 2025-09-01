export class Answer {
    constructor(
        public id: number,
        public text: string,
        public createdAt: string,
        public questionId: number,
        public userId: number
    ) { }
}

export class AnswerForm {
    constructor(
        public text: string,
        public questionId: number,
        public userId: number
    ) { }
}
