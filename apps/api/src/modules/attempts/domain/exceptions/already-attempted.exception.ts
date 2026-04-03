export class AlreadyAttemptedException extends Error {
  constructor(quizId: string) {
    super(`User has already attempted quiz "${quizId}"`)
    this.name = 'AlreadyAttemptedException'
  }
}
