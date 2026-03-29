export abstract class AuthException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('E-mail ou senha inválidos', 'INVALID_CREDENTIALS')
  }
}

export class EmailAlreadyExistsException extends AuthException {
  constructor(email: string) {
    super(`Já existe um usuário com o e-mail ${email}`, 'EMAIL_ALREADY_EXISTS')
  }
}

export class InvalidTokenException extends AuthException {
  constructor() {
    super('Token inválido ou expirado', 'INVALID_TOKEN')
  }
}
