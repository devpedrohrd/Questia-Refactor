import { Inject, Injectable } from '@nestjs/common'
import { User } from '@repo/api'
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { Cacheable } from 'src/common/cache'

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Cacheable('user', 300)
  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new UserNotFoundException(id)
    }

    return user
  }
}
