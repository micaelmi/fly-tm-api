import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listClubs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clubs",
    {
      schema: {
        summary: "List all clubs",
        tags: ["clubs"],
      },
    },
    async (request, reply) => {
      const { club } = request.query as { club?: string }; // Use o nome do parâmetro aqui
      console.log(club); // Exibe o valor do parâmetro "club" se ele existir

      const where: any = {};
      if (club) {
        where.name = {
          contains: club,
          mode: "insensitive",
        };
      }

      const clubs = await prisma.club.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          _count: {
            select: { users: true },
          },
        },
      });

      return reply.send({ clubs });
    }
  );
}
