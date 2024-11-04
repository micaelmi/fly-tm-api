import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createContact(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/contacts",
    {
      schema: {
        summary: "Create a contact",
        tags: ["contacts"],
        body: z.object({
          title: z.string(),
          description: z.string(),
          user_id: z.string().uuid(),
          contact_type_id: z.number(),
        }),
        response: {
          201: z.object({
            contactId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description, user_id, contact_type_id } = request.body;

      const contact = await prisma.contact.create({
        data: {
          title,
          description,
          user_id,
          contact_type_id,
        },
      });
      return reply.status(201).send({ contactId: contact.id });
    }
  );
}
