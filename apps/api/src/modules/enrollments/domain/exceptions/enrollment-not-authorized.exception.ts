export class EnrollmentNotAuthorizedException extends Error {
  constructor(message: string) {
    super('Not authorized to perform this action on the enrollment')
    this.name = 'EnrollmentNotAuthorizedException'
    this.message = message.toUpperCase().trim().replace(/ /g, '_')
  }
}
