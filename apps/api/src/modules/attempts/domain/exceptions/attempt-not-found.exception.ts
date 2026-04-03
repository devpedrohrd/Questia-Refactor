export class AttemptNotFoundException extends Error {
  constructor(id: string) {
    super(`Attempt with id "${id}" was not found`)
    this.name = 'AttemptNotFoundException'
  }
}
