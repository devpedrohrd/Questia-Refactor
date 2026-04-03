export class QuizNotPublishedException extends Error {
  constructor(quizId: string) {
    super(`Quiz "${quizId}" is not published yet`)
    this.name = 'QuizNotPublishedException'
  }
}
