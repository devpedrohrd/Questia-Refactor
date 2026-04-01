export class ClassNotAuthorizedException extends Error {
  constructor(message: string) {
    super('Not authorized to perform this action on the class')
    this.name = 'ClassNotAuthorizedException'
    this.message = message.toUpperCase().trim().replace(/ /g, '_')
  }
}
