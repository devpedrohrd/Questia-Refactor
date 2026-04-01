import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  override getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}
