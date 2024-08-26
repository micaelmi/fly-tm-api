import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function ListAllUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      schema: {
        summary: "List all the registered users",
        tags: ["users"],
      },
    },
    async (request) => {
      const users = await prisma.user.findMany();
      return { users: users };
    }
  );
}
