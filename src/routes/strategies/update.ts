import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateStrategy(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/strategies/:strategyId",
    {
      schema: {
        summary: "Update a strategy",
        tags: ["strategies"],
        params: z.object({
          strategyId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(1).optional(),
          how_it_works: z.string().optional(),
          icon_url: z.string().url().optional(),
          user_id: z.string().uuid().optional(),
          level_id: z.number().optional(),
          visibility_type_id: z.number().optional(),
          club_id: z.string().optional().optional(),
          items: z
            .array(
              z.object({
                id: z.number().optional(),
                description: z.string(),
                movement_id: z.number(),
              })
            )
            .optional(),
        }),
        response: {
          200: z.object({
            strategyId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { strategyId } = request.params;
      const {
        title,
        how_it_works,
        icon_url,
        user_id,
        level_id,
        visibility_type_id,
        club_id,
        items,
      } = request.body;

      const strategy = await prisma.strategy.update({
        where: { id: strategyId },
        data: {
          title,
          how_it_works,
          icon_url,
          user_id,
          level_id,
          visibility_type_id,
          club_id,
        },
      });

      if (items && items.length > 0) {
        // IDs dos itens fornecidos na requisição
        const existingItemIds = items
          .filter((item) => item.id !== undefined)
          .map((item) => item.id as number);

        // Deletar items que não estão mais presentes na requisição
        await prisma.strategyItem.deleteMany({
          where: {
            strategy_id: strategyId,
            id: {
              notIn: existingItemIds, // Corrigido para notIn
            },
          },
        });

        // Atualizar ou criar os items fornecidos
        for (const item of items) {
          if (item.id !== undefined) {
            // Atualiza o item existente
            await prisma.strategyItem.update({
              where: { id: item.id },
              data: {
                description: item.description,
                movement_id: item.movement_id,
              },
            });
          } else {
            // Cria um novo item
            await prisma.strategyItem.create({
              data: {
                description: item.description,
                movement_id: item.movement_id,
                strategy_id: strategyId,
              },
            });
          }
        }
      } else {
        // Se nenhum item for fornecido, deletar todos os relacionados ao treinamento
        await prisma.strategyItem.deleteMany({
          where: { strategy_id: strategyId },
        });
      }

      return reply.send({ strategyId: strategy.id });
    }
  );
}
