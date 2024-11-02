import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createMatch(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/scoreboards",
    {
      schema: {
        summary: "Create a match",
        tags: ["scoreboards"],
        body: z.object({
          player1: z.string(),
          player2: z.string(),
          better_of: z.number(),
          user_id: z.string().uuid(),
        }),
        response: {
          201: z.object({
            matchId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { player1, player2, better_of, user_id } = request.body;

      const match = await prisma.matchHistory.create({
        data: {
          player1,
          player2,
          better_of,
          user_id,
        },
      });
      return reply.status(201).send({ matchId: match.id });
    }
  );
}
