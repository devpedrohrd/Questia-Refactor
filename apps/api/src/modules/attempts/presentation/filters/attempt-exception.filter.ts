import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { AttemptNotFoundException } from '../../domain/exceptions/attempt-not-found.exception'
import { QuizNotPublishedException } from '../../domain/exceptions/quiz-not-published.exception'
import { AlreadyAttemptedException } from '../../domain/exceptions/already-attempted.exception'
import { QuizNotFoundException } from '../../../quizzes/domain/exceptions/quiz-not-found.exception'

const STATUS_CODES: Record<string, HttpStatus> = {
  AttemptNotFoundException: HttpStatus.NOT_FOUND,
  QuizNotFoundException: HttpStatus.NOT_FOUND,
  QuizNotPublishedException: HttpStatus.BAD_REQUEST,
  AlreadyAttemptedException: HttpStatus.CONFLICT,
}

@Catch(
  AttemptNotFoundException,
  QuizNotFoundException,
  QuizNotPublishedException,
  AlreadyAttemptedException,
)
export class AttemptExceptionFilter implements ExceptionFilter {
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
