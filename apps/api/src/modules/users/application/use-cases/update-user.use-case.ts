import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '@repo/api'
import {
  IUserRepository,
  USER_REPOSITORY,
  UpdateUserInput,
} from '../../domain/repositories/user.repository'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { AuthenticatedUser } from 'src/common/interfaces'
import { UserNotAutorizedException } from '../../domain/exceptions/user-not-autorized.exception'
import { Role } from 'src/common/enums'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateUserInput,
    userRequest: AuthenticatedUser,
  ): Promise<User> {
    const existingUser = await this.userRepository.findById(id)

    if (!existingUser) {
      throw new UserNotFoundException(id)
    }

    if (
      existingUser.id !== userRequest.userId &&
      userRequest.role !== Role.ADMIN
    ) {
      throw new UserNotAutorizedException('USER_NOT_AUTORIZED')
    }

    return this.userRepository.update(id, data)
  }
}
