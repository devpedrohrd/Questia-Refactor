export class GenerationContextNotAuthorizedException extends Error {
  constructor(message: string) {
    super('Not authorized to perform this action on the generation context')
    this.name = 'GenerationContextNotAuthorizedException'
    this.message = message.toUpperCase().trim().replace(/ /g, '_')
  }
}
