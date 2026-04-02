export class QuizNotFoundException extends Error {
  constructor(id: string) {
    super(`Quiz with id "${id}" was not found`)
    this.name = 'QuizNotFoundException'
  }
}
