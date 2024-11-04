import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";
import z from "zod";

export async function listCreditTransactions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/credits/:userId/transactions",
    {
      schema: {
        summary: "List credit transactions of a user",
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
          "You can only move credits of your own account"
        );
      }

      const creditTransactions = await prisma.creditTransaction.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      });

      return reply.send({ creditTransactions });
    }
  );
}
