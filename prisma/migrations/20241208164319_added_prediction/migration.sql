-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('REAL', 'FAKE');

-- CreateEnum
CREATE TYPE "Host" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TWITTER');

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "host" "Host" NOT NULL DEFAULT 'TWITTER',
    "username" TEXT NOT NULL,
    "prediction" "PredictionStatus",
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_id_key" ON "Prediction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_host_username_key" ON "Prediction"("host", "username");
