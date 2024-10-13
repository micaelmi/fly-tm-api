import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateTraining(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trainings/:trainingId",
    {
      schema: {
        summary: "Update a training",
        tags: ["trainings"],
        params: z.object({
          trainingId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(1).optional(),
          time: z.number().optional(), // seconds
          icon_url: z.string().url().optional(),
          user_id: z.string().uuid().optional(),
          level_id: z.number().optional(),
          visibility_type_id: z.number().optional(),
          club_id: z.string().optional(),
          items: z
            .array(
              z.object({
                id: z.number().optional(),
                counting_mode: z.enum(["reps", "time"]),
                reps: z.number(),
                time: z.number(),
                queue: z.number(),
                comments: z.string(),
                movement_id: z.number(),
              })
            )
            .optional(),
        }),
        response: {
          200: z.object({
            trainingId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { trainingId } = request.params;
      const {
        title,
        time,
        icon_url,
        user_id,
        level_id,
        visibility_type_id,
        club_id,
        items,
      } = request.body;

      // Atualizar o treinamento
      const training = await prisma.training.update({
        where: { id: trainingId },
        data: {
          title,
          time,
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
        await prisma.trainingItem.deleteMany({
          where: {
            training_id: trainingId,
            id: {
              notIn: existingItemIds, // Corrigido para notIn
            },
          },
        });

        // Atualizar ou criar os items fornecidos
        for (const item of items) {
          if (item.id !== undefined) {
            // Atualiza o item existente
            await prisma.trainingItem.update({
              where: { id: item.id },
              data: {
                counting_mode: item.counting_mode,
                reps: item.reps,
                time: item.time,
                queue: item.queue,
                comments: item.comments,
                movement_id: item.movement_id,
              },
            });
          } else {
            // Cria um novo item
            await prisma.trainingItem.create({
              data: {
                counting_mode: item.counting_mode,
                reps: item.reps,
                time: item.time,
                queue: item.queue,
                comments: item.comments,
                movement_id: item.movement_id,
                training_id: trainingId,
              },
            });
          }
        }
      } else {
        // Se nenhum item for fornecido, deletar todos os relacionados ao treinamento
        await prisma.trainingItem.deleteMany({
          where: { training_id: trainingId },
        });
      }

      return reply.send({ trainingId: training.id });
    }
  );
}
