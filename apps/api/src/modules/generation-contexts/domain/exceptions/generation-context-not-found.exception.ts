export class GenerationContextNotFoundException extends Error {
  constructor(id: string) {
    super(`GenerationContext with id "${id}" was not found`)
    this.name = 'GenerationContextNotFoundException'
  }
}
