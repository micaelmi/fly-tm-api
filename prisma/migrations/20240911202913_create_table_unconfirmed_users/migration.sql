-- CreateTable
CREATE TABLE "unconfirmed_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_type_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "unconfirmed_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unconfirmed_users_username_key" ON "unconfirmed_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "unconfirmed_users_email_key" ON "unconfirmed_users"("email");
