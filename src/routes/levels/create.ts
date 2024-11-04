import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/levels",
    {
      schema: {
        summary: "Create a level",
        tags: ["auxiliaries"],
        body: z.object({
          title: z.string(),
          description: z.string(),
        }),
        response: {
          201: z.object({
            levelId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError("This user is not allowed to create levels");
      }

      const level = await prisma.level.create({
        data: { title, description },
      });
      return reply.status(201).send({ levelId: level.id });
    }
  );
}
