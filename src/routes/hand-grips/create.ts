import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createHandGrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/hand-grips",
    {
      schema: {
        summary: "Create a hand grip",
        tags: ["auxiliaries"],
        body: z.object({
          title: z.string(),
          description: z.string(),
        }),
        response: {
          201: z.object({
            handGripId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to create hand grips"
        );
      }

      const handGrip = await prisma.handGrip.create({
        data: { title, description },
      });
      return reply.status(201).send({ handGripId: handGrip.id });
    }
  );
}
