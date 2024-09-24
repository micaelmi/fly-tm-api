import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../env";

const secretKey = env.SECRET_JWT_KEY;

export const verifyToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    request.user = decoded;
  } catch (err: any) {
    console.error("Erro na verificação do token:", err.message);
    return reply.status(401).send({ error: "Token inválido" });
  }
};
