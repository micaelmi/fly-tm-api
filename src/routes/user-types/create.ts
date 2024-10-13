import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createUserType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user-types",
    {
      schema: {
        summary: "Create an user type",
        tags: ["auxiliaries", "users"],
        body: z.object({
          description: z.string(),
        }),
        response: {
          201: z.object({
            userTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete user types"
        );
      }

      const userType = await prisma.userType.create({
        data: { description },
      });
      return reply.status(201).send({ userTypeId: userType.id });
    }
  );
}
