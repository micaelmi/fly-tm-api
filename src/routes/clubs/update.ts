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
          name: z.string().optional(),
          description: z.string().optional(),
          logo_url: z.string().url().optional(),
          background: z.string().optional(),
          owner_username: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          instagram: z.string().url().optional(),
          other_contacts: z.string().optional(),
          schedule: z.string().optional(),
          prices: z.string().optional(),
          cep: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          neighborhood: z.string().optional(),
          street: z.string().optional(),
          address_number: z.number().optional(),
          complement: z.string().optional(),
          maps_url: z.string().url().optional(),
          max_members: z.number().optional(),
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
        max_members,
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
          max_members,
        },
      });
      return reply.send({ clubId: club.id });
    }
  );
}
