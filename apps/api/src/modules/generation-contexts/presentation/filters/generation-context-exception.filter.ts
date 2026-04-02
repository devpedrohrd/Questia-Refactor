import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { GenerationContextNotFoundException } from '../../domain/exceptions/generation-context-not-found.exception'
import { GenerationContextNotAuthorizedException } from '../../domain/exceptions/generation-context-not-authorized.exception'

const STATUS_CODES = {
  GENERATION_CONTEXT_NOT_FOUND: HttpStatus.NOT_FOUND,
  GENERATION_CONTEXT_NOT_AUTHORIZED: HttpStatus.FORBIDDEN,
}

@Catch(
  GenerationContextNotFoundException,
  GenerationContextNotAuthorizedException,
)
export class GenerationContextExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      STATUS_CODES[exception.name] || HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    })
  }
}
