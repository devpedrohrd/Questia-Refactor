export class QuizNotAuthorizedException extends Error {
  constructor(message: string) {
    super('Not authorized to perform this action on the quiz')
    this.name = 'QuizNotAuthorizedException'
    this.message = message.toUpperCase().trim().replace(/ /g, '_')
  }
}
