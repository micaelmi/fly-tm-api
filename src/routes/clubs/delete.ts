import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/clubs/:clubId",
    {
      schema: {
        summary: "Delete a club by id",
        tags: ["clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;

      const deletedClub = await prisma.$transaction(async (prisma) => {
        // Recupera os dados do clube antes de deletar
        const club = await prisma.club.findUnique({
          where: { id: clubId },
        });

        if (!club) {
          throw new Error("Clube não encontrado");
        }

        // Remove o club_id de todos os usuários associados ao clube
        await prisma.user.updateMany({
          where: {
            club_id: clubId,
          },
          data: {
            club_id: null,
          },
        });

        // Atualiza os treinamentos associados ao clube
        await prisma.training.updateMany({
          where: {
            club_id: clubId,
          },
          data: {
            club_id: null,
            visibility_type_id: 2, // private
          },
        });

        // Atualiza as estratégias associadas ao clube
        await prisma.strategy.updateMany({
          where: {
            club_id: clubId,
          },
          data: {
            club_id: null,
            visibility_type_id: 2, // private
          },
        });

        // Deleta o clube
        await prisma.club.delete({
          where: { id: clubId },
        });

        // Retorna os dados do clube recuperados antes da exclusão
        return club;
      });

      return reply.send({ club: deletedClub });
    }
  );
}
