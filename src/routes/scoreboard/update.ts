import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateMatch(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/scoreboards/:matchId",
    {
      schema: {
        summary: "Update a match",
        tags: ["scoreboards"],
        params: z.object({
          matchId: z.string().uuid(),
        }),
        body: z.object({
          player1: z.string().optional(),
          player2: z.string().optional(),
          better_of: z.number().optional(),
          games: z
            .array(
              z.object({
                id: z.number().optional(),
                points_player1: z.number(),
                points_player2: z.number(),
                game_number: z.number(),
              })
            )
            .optional(),
        }),
        response: {
          200: z.object({
            matchId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { matchId } = request.params;
      const { player1, player2, better_of, games } = request.body;

      const match = await prisma.matchHistory.update({
        where: { id: matchId },
        data: {
          player1,
          player2,
          better_of,
        },
      });

      if (games && games.length > 0) {
        // IDs dos itens fornecidos na requisição
        const existingItemIds = games
          .filter((item) => item.id !== undefined)
          .map((item) => item.id as number);

        // Deletar games que não estão mais presentes na requisição
        await prisma.gameHistory.deleteMany({
          where: {
            match_history_id: matchId,
            id: {
              notIn: existingItemIds, // Corrigido para notIn
            },
          },
        });

        // Atualizar ou criar os games fornecidos
        for (const item of games) {
          if (item.id !== undefined) {
            // Atualiza o item existente
            await prisma.gameHistory.update({
              where: { id: item.id },
              data: {
                points_player1: item.points_player1,
                points_player2: item.points_player2,
                game_number: item.game_number,
              },
            });
          } else {
            // Cria um novo item
            await prisma.gameHistory.create({
              data: {
                points_player1: item.points_player1,
                points_player2: item.points_player2,
                game_number: item.game_number,
                match_history_id: matchId,
              },
            });
          }
        }
      } else {
        // Se nenhum item for fornecido, deletar todos os relacionados ao treinamento
        await prisma.gameHistory.deleteMany({
          where: { match_history_id: matchId },
        });
      }

      return reply.send({ matchId: match.id });
    }
  );
}
