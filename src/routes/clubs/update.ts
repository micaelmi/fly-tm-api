import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/clubs/:clubId",
    {
      schema: {
        summary: "Update a club",
        tags: ["clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          logo_url: z.string().url(),
          background: z.string(),
          owner_username: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          instagram: z.string().url().optional(),
          other_contacts: z.string().optional(),
          schedule: z.string(),
          prices: z.string(),
          cep: z.string(),
          state: z.string(),
          city: z.string(),
          neighborhood: z.string(),
          street: z.string(),
          address_number: z.number().optional(),
          complement: z.string().optional(),
          maps_url: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const {
        name,
        description,
        logo_url,
        background,
        owner_username,
        email,
        phone,
        instagram,
        other_contacts,
        schedule,
        prices,
        cep,
        state,
        city,
        neighborhood,
        street,
        address_number,
        complement,
        maps_url,
      } = request.body;

      const club = await prisma.club.update({
        where: { id: clubId },
        data: {
          name,
          description,
          logo_url,
          background,
          owner_username,
          email,
          phone,
          instagram,
          other_contacts,
          schedule,
          prices,
          cep,
          state,
          city,
          neighborhood,
          street,
          address_number,
          complement,
          maps_url,
        },
      });
      return reply.send({ clubId: club.id });
    }
  );
}
