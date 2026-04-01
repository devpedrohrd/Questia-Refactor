export class ClassNotFoundException extends Error {
  constructor(id: string) {
    super(`Class with id "${id}" was not found`)
    this.name = 'ClassNotFoundException'
  }
}
