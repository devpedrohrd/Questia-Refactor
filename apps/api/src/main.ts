import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const logger = new Logger('Bootstrap')
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${reason}`,
    reason instanceof Error ? reason.stack : undefined,
  )
})

// Catch uncaught exceptions - these require shutdown
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error.stack)
  process.exit(1)
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipUndefinedProperties: false,
    }),
  )

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('Questia')
    .setVersion('1.0')
    .setDescription('Questia API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, documentFactory)

  const port = process.env.PORT || 3333

  // Enable graceful shutdown hooks
  app.enableShutdownHooks()

  await app.listen(port)
  logger.log(`🚀 Application is running on port: ${port}`)

  const shutdown = async (signal: string) => {
    logger.log(`Received ${signal}, starting graceful shutdown...`)

    // Give in-flight requests time to complete (configurable)
    const shutdownTimeout = parseInt(
      process.env.SHUTDOWN_TIMEOUT_MS ?? '10000',
      10,
    )

    const forceExit = setTimeout(() => {
      logger.warn('Graceful shutdown timed out, forcing exit')
      process.exit(1)
    }, shutdownTimeout)

    try {
      await app.close() // Triggers onModuleDestroy hooks
      clearTimeout(forceExit)
      logger.log('Graceful shutdown completed')
      process.exit(0)
    } catch (error) {
      logger.error('Error during graceful shutdown:', error)
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

bootstrap()
