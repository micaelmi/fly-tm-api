import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createMatch } from "../create";
import { deleteMatch } from "../delete";
import { getMatchById } from "../get-by-id";
import { listMatchesByUser } from "../list-by-user";
import { recordGame } from "../record-game";
import { startGame } from "../start-game";
import { updateMatch } from "../update";
import { updateScore } from "../update-score";

export async function scoreboardRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();
  typedApp.register(createMatch);
  typedApp.register(deleteMatch);
  typedApp.register(getMatchById);
  typedApp.register(listMatchesByUser);
  typedApp.register(recordGame);
  typedApp.register(startGame);
  typedApp.register(updateMatch);
  typedApp.register(updateScore);
}
