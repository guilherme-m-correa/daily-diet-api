import { app } from './app'
import { env } from './config/env'

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
    })
    console.log('HTTP Server Running!')
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
