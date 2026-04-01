export class ClassCodeAlreadyExistsException extends Error {
  constructor(code: string) {
    super(`A class with code "${code}" already exists`)
    this.name = 'ClassCodeAlreadyExistsException'
  }
}
