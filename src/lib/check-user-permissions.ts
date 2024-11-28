// see if user is admin based on the token user.type and return boolean
// type Admin === 3

import { FastifyRequest } from "fastify";

export const isAdmin = (request: FastifyRequest): boolean => {
  const user = request.user;
  return user?.type === 2;
};
