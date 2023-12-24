import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
})

fastify.get('/', async (_, reply) => {
  return reply.send({ message: 'Hello World' })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3333 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
