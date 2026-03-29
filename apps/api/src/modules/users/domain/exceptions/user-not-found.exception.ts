export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`User with id "${id}" was not found`)
    this.name = 'UserNotFoundException'
  }
}
