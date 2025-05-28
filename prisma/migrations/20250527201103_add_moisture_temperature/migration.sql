/*
  Warnings:

  - You are about to alter the column `healthScore` on the `SoilAnalysis` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "SoilAnalysis" ADD COLUMN     "moisture" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "healthScore" SET DATA TYPE INTEGER;
