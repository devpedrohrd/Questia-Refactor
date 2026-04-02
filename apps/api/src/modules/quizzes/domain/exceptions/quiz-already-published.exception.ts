export class QuizAlreadyPublishedException extends Error {
  constructor(id: string) {
    super(`Quiz "${id}" is already published and cannot be modified`)
    this.name = 'QuizAlreadyPublishedException'
  }
}
