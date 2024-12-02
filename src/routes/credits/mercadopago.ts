// payments/create.ts
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";
import axios from "axios";

export async function createPixPayment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/payments/pix",
    {
      schema: {
        summary: "Create a PIX payment",
        tags: ["payments"],
        body: z.object({
          amount: z.number().positive(),
          description: z.string().min(1),
          user_id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { amount, description, user_id } = request.body;

      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
        options: { timeout: 5000 },
      });

      const payment = new Payment(client);

      const user = await prisma.user.findFirst({
        where: { id: user_id },
        select: {
          email: true,
        },
      });
      if (!user) {
        reply.status(404).send({ error: "Usuário não encontrado" });
        return;
      }

      const body = {
        transaction_amount: amount,
        description,
        payment_method_id: "pix",
        payer: {
          email: user.email,
        },
      };

      const idempotencyKey = crypto.randomUUID();
      const requestOptions = { idempotencyKey: idempotencyKey };

      try {
        const response = await payment.create({ body, requestOptions });

        const pix = {
          id: response.id, // ID do pagamento
          status: response.status, // Status do pagamento
          amount: response.transaction_amount, // Valor da transação
          currency: response.currency_id, // Moeda da transação
          qrCode: response.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64:
            response.point_of_interaction?.transaction_data?.qr_code_base64,
          creationDate: response.date_created, // Data de criação do pagamento
          expirationDate: response.date_of_expiration, // Data de expiração do pagamento
          externalReference: response.external_reference, // Referência externa fornecida na criação do pagamento
        };

        // Retorne os dados essenciais do pagamento
        return reply.status(201).send({ pix });
      } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        reply.status(500).send({ error: "Erro ao criar pagamento via PIX" });
      }
    }
  );
}

export async function verifyPixPayment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/payments/pix/:id",
    {
      schema: {
        summary: "Create a PIX payment",
        tags: ["payments"],
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        const url = `https://api.mercadopago.com/v1/payments/${id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        reply.status(500).send({ error: "Erro ao criar pagamento via PIX" });
      }
    }
  );
}
