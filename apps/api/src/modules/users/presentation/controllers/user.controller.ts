import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { UpdateUserDto } from '../dtos/update-user.dto'
import { UserExceptionFilter } from '../filters/user-exception.filter'
import { FindUserUseCase } from '../../application/use-cases/find-user.use-case'
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case'
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case'
import { AuthenticatedUser } from 'src/common/interfaces'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { CurrentUser, Roles } from 'src/common/decorators'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Role } from 'src/common/enums'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Busca o usuário logado' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findMe(@CurrentUser() user: AuthenticatedUser) {
    return this.findUserUseCase.execute(user.userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca o usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findById(@Param('id') id: string) {
    return this.findUserUseCase.execute(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza o usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateUserUseCase.execute(id, dto, user)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Deleta o usuário pelo id' })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.deleteUserUseCase.execute(id, user)
  }
}
