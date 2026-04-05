import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { getForgotPasswordEmailTemplate } from './presentation/templates/forgot-password.template'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  private readonly logger = new Logger(MailService.name)

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${token}`
    const { text, html } = getForgotPasswordEmailTemplate(resetUrl)

    try {
      await this.transporter.sendMail({
        from: '"Questia"',
        to: email,
        subject: 'Recuperação de Senha',
        text,
        html,
      })
      this.logger.log(`Password reset email sent to ${email}`)
    } catch (error) {
      this.logger.error(
        `Error sending email to ${email}`,
        error instanceof Error ? error.stack : String(error),
      )
      throw new BadRequestException('ERROR_SENDING_EMAIL')
    }
  }
}
