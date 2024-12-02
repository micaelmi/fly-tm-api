import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { errorHandler } from "./error-handler";
import { verifyToken } from "./middlewares/verify-token";
import { createClub } from "./routes/clubs/create";
import { deleteClub } from "./routes/clubs/delete";
import { getClubById } from "./routes/clubs/get-by-id";
import { getClubsByOwner } from "./routes/clubs/get-by-owner";
import { listClubs } from "./routes/clubs/list";
import { updateClub } from "./routes/clubs/update";
import { createEvent } from "./routes/events/create";
import { deleteEvent } from "./routes/events/delete";
import { getEventById } from "./routes/events/get-by-id";
import { getEventsByOwner } from "./routes/events/get-by-owner";
import { listEvents } from "./routes/events/list";
import { updateEvent } from "./routes/events/update";
import { changePassword } from "./routes/users/change-password";
import { confirmEmail } from "./routes/users/confirm-email";
import { confirmRecoveryToken } from "./routes/users/confirm-recovery-token";
import { listAllUsers } from "./routes/users/list";
import { login } from "./routes/users/login";
import { recoverAccount } from "./routes/users/recover-account";
import { registerUser } from "./routes/users/register";
import { getUserByUsername } from "./routes/users/get-by-username";
import { changeUsername } from "./routes/users/change-username";
import { getUsersByClub } from "./routes/users/get-users-by-club";
import { createTraining } from "./routes/trainings/create";
import { listTrainings } from "./routes/trainings/list";
import { deleteTraining } from "./routes/trainings/delete";
import { updateTraining } from "./routes/trainings/update";
import { getTrainingById } from "./routes/trainings/get-by-id";
import { getTrainingsByOwner } from "./routes/trainings/get-by-owner";
import { getTrainingsByClub } from "./routes/trainings/get-by-club";
import { createStrategy } from "./routes/strategies/create";
import { listStrategies } from "./routes/strategies/list";
import { deleteStrategy } from "./routes/strategies/delete";
import { updateStrategy } from "./routes/strategies/update";
import { getStrategyById } from "./routes/strategies/get-by-id";
import { getStrategiesByOwner } from "./routes/strategies/get-by-owner";
import { getStrategiesByClub } from "./routes/strategies/get-by-club";
import { createMovement } from "./routes/movements/create";
import { listMovements } from "./routes/movements/list";
import { deleteMovement } from "./routes/movements/delete";
import { updateMovement } from "./routes/movements/update";
import { getMovementById } from "./routes/movements/get-by-id";
import { createContact } from "./routes/contacts/create";
import { listContacts } from "./routes/contacts/list";
import { deleteContact } from "./routes/contacts/delete";
import { answerContact } from "./routes/contacts/answer";
import { getContactsByUser } from "./routes/contacts/get-by-user";
import { getContactsById } from "./routes/contacts/get-by-id";
import { createUserType } from "./routes/user-types/create";
import { listUserTypes } from "./routes/user-types/list";
import { deleteUserType } from "./routes/user-types/delete";
import { updateUserType } from "./routes/user-types/update";
import { addMemberToClub } from "./routes/clubs/add-member";
import { leaveClub } from "./routes/clubs/leave-club";
import { deleteUser } from "./routes/users/delete";
import { updateUser } from "./routes/users/update";
import { createMatch } from "./routes/scoreboards/create";
import { listMatchesByUser } from "./routes/scoreboards/list-by-user";
import { getMatchById } from "./routes/scoreboards/get-by-id";
import { deleteMatch } from "./routes/scoreboards/delete";
import { recordGame } from "./routes/scoreboards/record-game";
import { updateMatch } from "./routes/scoreboards/update";
import { createLevel } from "./routes/levels/create";
import { listLevels } from "./routes/levels/list";
import { deleteLevel } from "./routes/levels/delete";
import { updateLevel } from "./routes/levels/update";
import { createGameStyle } from "./routes/game-styles/create";
import { listGameStyles } from "./routes/game-styles/list";
import { deleteGameStyle } from "./routes/game-styles/delete";
import { updateGameStyle } from "./routes/game-styles/update";
import { createHandGrip } from "./routes/hand-grips/create";
import { listHandGrips } from "./routes/hand-grips/list";
import { deleteHandGrip } from "./routes/hand-grips/delete";
import { updateHandGrip } from "./routes/hand-grips/update";
import { createContactType } from "./routes/contact-types/create";
import { listContactTypes } from "./routes/contact-types/list";
import { deleteContactType } from "./routes/contact-types/delete";
import { updateContactType } from "./routes/contact-types/update";
import { createVisibilityType } from "./routes/visibility-types/create";
import { listVisibilityTypes } from "./routes/visibility-types/list";
import { deleteVisibilityType } from "./routes/visibility-types/delete";
import { updateVisibilityType } from "./routes/visibility-types/update";
import { moveCredits } from "./routes/credits/movement";
import { listCreditTransactions } from "./routes/credits/list";
import {
  createPixPayment,
  verifyPixPayment,
} from "./routes/credits/mercadopago";
import { getCreditsByUser } from "./routes/credits/get-credits-by-user";
import { incrementTrainingDays } from "./routes/trainings/increment-training-days";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Fly TM API",
      description: "API para o app de tênis de mesa Fly TM",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

// user public routes
app.register(registerUser);
app.register(confirmEmail);
app.register(login);
app.register(recoverAccount);
app.register(confirmRecoveryToken);
app.register(changePassword);

app.register(async (app) => {
  app.addHook("preHandler", verifyToken);

  // user authenticated routes
  app.register(listAllUsers);
  app.register(getUserByUsername);
  app.register(changeUsername);
  app.register(getUsersByClub);
  app.register(updateUser);
  app.register(deleteUser);

  // event routes
  app.register(createEvent);
  app.register(listEvents);
  app.register(deleteEvent);
  app.register(updateEvent);
  app.register(getEventById);
  app.register(getEventsByOwner);

  // club routes
  app.register(createClub);
  app.register(listClubs);
  app.register(deleteClub);
  app.register(updateClub);
  app.register(getClubById);
  app.register(getClubsByOwner);
  app.register(addMemberToClub);
  app.register(leaveClub);

  // training routes
  app.register(createTraining);
  app.register(listTrainings);
  app.register(deleteTraining);
  app.register(updateTraining);
  app.register(getTrainingById);
  app.register(getTrainingsByOwner);
  app.register(getTrainingsByClub);
  app.register(incrementTrainingDays);

  // strategy routes
  app.register(createStrategy);
  app.register(listStrategies);
  app.register(deleteStrategy);
  app.register(updateStrategy);
  app.register(getStrategyById);
  app.register(getStrategiesByOwner);
  app.register(getStrategiesByClub);

  // Movement routes
  app.register(createMovement);
  app.register(listMovements);
  app.register(deleteMovement);
  app.register(updateMovement);
  app.register(getMovementById);

  // Contact routes
  app.register(createContact);
  app.register(listContacts);
  app.register(deleteContact);
  app.register(answerContact);
  app.register(getContactsByUser);
  app.register(getContactsById);

  // scoreboard routes
  app.register(createMatch);
  app.register(listMatchesByUser);
  app.register(getMatchById);
  app.register(deleteMatch);
  app.register(recordGame);
  app.register(updateMatch);

  // user type routes
  app.register(createUserType);
  app.register(listUserTypes);
  app.register(deleteUserType);
  app.register(updateUserType);

  // level routes
  app.register(createLevel);
  app.register(listLevels);
  app.register(deleteLevel);
  app.register(updateLevel);

  // game style routes
  app.register(createGameStyle);
  app.register(listGameStyles);
  app.register(deleteGameStyle);
  app.register(updateGameStyle);

  // hand grip routes
  app.register(createHandGrip);
  app.register(listHandGrips);
  app.register(deleteHandGrip);
  app.register(updateHandGrip);

  // contact type routes
  app.register(createContactType);
  app.register(listContactTypes);
  app.register(deleteContactType);
  app.register(updateContactType);

  // visibility type routes
  app.register(createVisibilityType);
  app.register(listVisibilityTypes);
  app.register(deleteVisibilityType);
  app.register(updateVisibilityType);

  // credit routes
  app.register(moveCredits);
  app.register(listCreditTransactions);
  app.register(getCreditsByUser);
  // mercado pago
  app.register(createPixPayment);
  app.register(verifyPixPayment);
});

app.listen({ port: env.PORT }).then(() => {
  console.log("Server flying! 🚀");
});
