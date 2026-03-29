export class UserNotAutorizedException extends Error {
  constructor(message: string) {
    super('User not authorized')
    this.name = 'UserNotAutorizedException'
    this.message = message.toUpperCase().trim().replace(/ /g, '_')
  }
}
