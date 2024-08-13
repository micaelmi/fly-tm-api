import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";

export async function confirmRecoveryToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/recover-account/confirm-recovery-token",
    {
      schema: {
        summary: "Confirm token to change password",
        tags: ["users"],
        querystring: z.object({
          token_number: z.number().int().positive().min(1000).max(9999),
          user: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { token_number, user } = request.query;

      const token = await prisma.token.findFirst({
        where: {
          number: token_number,
          expiration: {
            gte: new Date(),
          },
          status: "active",
          user_email: user,
        },
      });

      if (!token) throw new ClientError("Token invalid");

      await prisma.token.update({
        data: { status: "inactive" },
        where: { id: token.id },
      });

      // redirect to change password page
      return reply.redirect(
        `${env.FRONTEND_BASE_URL}/auth/nova-senha?token=${token_number}&email=${user}`
      );
    }
  );
}
