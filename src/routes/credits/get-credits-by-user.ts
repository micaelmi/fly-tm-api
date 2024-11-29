import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";
import z from "zod";

export async function getCreditsByUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/credits/user/:userId",
    {
      schema: {
        summary: "Get credits by user",
        tags: ["credits", "users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const request_owner = request.user;
      if (request_owner.sub !== userId && !isAdmin(request)) {
        throw new ForbiddenError(
          "You can only get credits of your own account"
        );
      }

      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: {
          credits: true,
          email: true,
        },
      });

      return reply.send({ user });
    }
  );
}
