import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../errors/forbidden-error";
import { BadRequest } from "../../errors/bad-request";

export async function moveCredits(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/credits",
    {
      schema: {
        summary: "Move credits of your account",
        tags: ["credits"],
        body: z.object({
          action: z.enum(["spend", "buy"]),
          amount: z.number(),
          description: z.string(),
          user_id: z.string().uuid(),
        }),
        response: {
          201: z.object({
            transactionId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { action, amount, description, user_id } = request.body;

      const request_owner = request.user;
      if (request_owner.sub !== user_id) {
        throw new ForbiddenError(
          "You can only move credits of your own account"
        );
      }

      const user = await prisma.user.findFirst({
        where: { id: user_id },
        select: {
          credits: true,
        },
      });

      if (!user) throw new BadRequest("User not found");

      let transactionId = "";

      if (action === "buy") {
        const [, credit] = await prisma.$transaction([
          prisma.user.update({
            where: { id: user_id },
            data: {
              credits: {
                increment: amount,
              },
            },
          }),
          prisma.creditTransaction.create({
            data: { action, amount, description, user_id },
          }),
        ]);
        transactionId = credit.id;
      } else if (action === "spend") {
        if (user.credits < amount) throw new BadRequest("Not enough credits");
        const [, credit] = await prisma.$transaction([
          prisma.user.update({
            where: { id: user_id },
            data: {
              credits: {
                decrement: amount,
              },
            },
          }),
          prisma.creditTransaction.create({
            data: { action, amount, description, user_id },
          }),
        ]);
        transactionId = credit.id;
      }

      return reply.status(201).send({ transactionId });
    }
  );
}
