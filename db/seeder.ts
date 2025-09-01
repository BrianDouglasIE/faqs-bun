import { faker } from "@faker-js/faker";
import { ProjectForm, ProjectUserForm, ProjectUserRole } from "../models/project";
import { UserForm } from "../models/user";
import { Question, QuestionForm } from "../models/question";
import { AnswerForm } from "../models/answer";

export const users: UserForm[] = [
    new UserForm('brian@gmail.com', 'password'),
    new UserForm('emma@gmail.com', 'password'),
    new UserForm('robyn@gmail.com', 'password'),
    new UserForm('breanna@gmail.com', 'password'),
];

export const projects: ProjectForm[] = [
    new ProjectForm(faker.company.name(), [
        new ProjectUserForm(1, ProjectUserRole.OWNER),
        new ProjectUserForm(3, ProjectUserRole.READER),
        new ProjectUserForm(4, ProjectUserRole.READER)
    ]),
    new ProjectForm(faker.company.name(), [
        new ProjectUserForm(1, ProjectUserRole.EDITOR),
        new ProjectUserForm(2, ProjectUserRole.OWNER),
    ]),
    new ProjectForm(faker.company.name(), [
        new ProjectUserForm(1, ProjectUserRole.OWNER),
        new ProjectUserForm(2, ProjectUserRole.EDITOR),
        new ProjectUserForm(3, ProjectUserRole.READER),
        new ProjectUserForm(4, ProjectUserRole.READER)
    ]),
]

export const questions: QuestionForm[] = [
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 1, 1),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 1, 3),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 1, 1),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 2, 2),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 2, 4),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 3, 4),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 3, 2),
    new QuestionForm(faker.word.words({ count: { min: 6, max: 12 } }) + '?', 3, 1),
];

export const answers: AnswerForm[] = [
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 1, 2),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 2, 4),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 2, 4),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 3, 2),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 4, 1),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 5, 1),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 6, 3),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 7, 3),
    new AnswerForm(faker.word.words({ count: { min: 8, max: 15 } }), 8, 2),
];