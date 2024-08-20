import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";

export async function changePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/recover-account/change-password",
    {
      schema: {
        summary: "Change user password",
        tags: ["users"],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8).max(32),
          token_number: z.number().int().positive().min(1000).max(9999),
        }),
      },
    },
    async (request) => {
      const { email, password, token_number } = request.body;

      const user = await prisma.user.findFirst({
        where: { email },
      });
      const token = await prisma.token.findFirst({
        where: {
          number: token_number,
          user_email: email,
          expiration: {
            gte: new Date(),
          },
          status: "inactive",
        },
      });

      if (!user || !token) throw new ClientError("Token invalid or expired");

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: { id: user.id, status: "active" },
      });

      if (!updatedUser) throw new Error("Password could not be updated");

      return { userId: updatedUser.id };
    }
  );
}
