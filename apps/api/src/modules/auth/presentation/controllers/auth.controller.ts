import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
  Res,
  Get,
  Headers,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  LoginUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  RegisterUseCase,
} from '../../application/use-cases'
import { LoginDto, RegisterDto } from '../dtos'
import { AuthExceptionFilter } from '../filters'
import { Response } from 'express'
import { ForgotPasswordDto } from '../dtos/forgot-password.dto'
import { ResetPasswordDto } from '../dtos/reset-password.dto'
import { handleAuthResponse } from '../handles/handleAuth'
import { RefreshTokenDto } from '../dtos/login.dto'
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case'

@ApiTags('Auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshUseCase: RefreshUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email já cadastrado' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-platform') platformHeader: string,
  ) {
    const { accessToken, refreshToken } =
      await this.registerUseCase.execute(dto)

    return handleAuthResponse({
      isRefresh: false,
      platformHeader,
      res,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e obter JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 403, description: 'Empresa inativa' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-platform') platformHeader: string,
  ) {
    const { accessToken, refreshToken } = await this.loginUseCase.execute(dto)

    return handleAuthResponse({
      isRefresh: false,
      platformHeader,
      res,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar tokens' })
  @ApiResponse({ status: 200, description: 'Tokens atualizados com sucesso' })
  @ApiResponse({ status: 401, description: 'Tokens inválidos' })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-platform') platformHeader: string,
  ) {
    const { accessToken, refreshToken } = await this.refreshUseCase.execute(dto)

    return handleAuthResponse({
      isRefresh: true,
      platformHeader,
      res,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    })
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deslogar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deslogado com sucesso' })
  async logout(@Res() res: Response) {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    return res.status(HttpStatus.OK).json({
      message: 'Usuário deslogado com sucesso',
    })
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Esquecer senha' })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 404, description: 'Email não encontrado' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res: Response) {
    await this.forgotPasswordUseCase.execute(dto.email)
    return res.status(HttpStatus.OK).json({
      message: 'Email enviado com sucesso',
    })
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto, @Res() res: Response) {
    await this.resetPasswordUseCase.execute(dto.token, dto.newPassword)
    return res.status(HttpStatus.OK).json({
      message: 'Senha redefinida com sucesso',
    })
  }
}
