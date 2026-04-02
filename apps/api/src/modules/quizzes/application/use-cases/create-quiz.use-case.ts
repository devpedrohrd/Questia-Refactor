import { Inject, Injectable } from '@nestjs/common'
import { Quiz } from '@repo/api'
import {
  IQuizRepository,
  QUIZ_REPOSITORY,
  CreateQuizInput,
} from '../../domain/repositories/quiz.repository'
import { AuthenticatedUser } from 'src/common/interfaces'
import { randomBytes } from 'crypto'

@Injectable()
export class CreateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(
    data: Omit<CreateQuizInput, 'userId' | 'accessLink' | 'status'>,
    user: AuthenticatedUser,
  ): Promise<Quiz> {
    const accessLink = this.generateAccessLink()

    return this.quizRepository.create({
      ...data,
      userId: user.userId,
      accessLink,
      status: 'DRAFT',
    })
  }

  private generateAccessLink(): string {
    return randomBytes(8).toString('hex')
  }
}
