import { Inject, Injectable } from '@nestjs/common'
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { UserNotAutorizedException } from '../../domain/exceptions/user-not-autorized.exception'
import { Role } from 'src/common/enums'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, userRequest: AuthenticatedUser): Promise<void> {
    const existingUser = await this.userRepository.findById(id)

    if (!existingUser) {
      throw new UserNotFoundException(id)
    }

    if (userRequest.role !== Role.ADMIN) {
      throw new UserNotAutorizedException('USER_NOT_AUTORIZED')
    }

    await this.userRepository.delete(id)
  }
}
