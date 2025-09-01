export class Question {
    constructor(
        public id: number,
        public text: string,
        public createdAt: string,
        public projectId: number,
        public userId: number
    ) { }
}

export class QuestionForm {
    constructor(
        public text: string,
        public projectId: number,
        public userId: number
    ) { }
}
