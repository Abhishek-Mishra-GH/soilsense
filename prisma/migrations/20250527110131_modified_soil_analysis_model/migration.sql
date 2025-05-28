/*
  Warnings:

  - You are about to drop the column `k` on the `SoilAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `moisture` on the `SoilAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `n` on the `SoilAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `p` on the `SoilAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `pH` on the `SoilAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedCrop` on the `SoilAnalysis` table. All the data in the column will be lost.
  - Added the required column `healthScore` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `healthStatus` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nitrogen` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phLevel` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phStatus` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phosphorus` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potassium` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soilDescription` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoilAnalysis" DROP COLUMN "k",
DROP COLUMN "moisture",
DROP COLUMN "n",
DROP COLUMN "p",
DROP COLUMN "pH",
DROP COLUMN "recommendedCrop",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "healthScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "healthStatus" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "nitrogen" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phLevel" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phStatus" TEXT NOT NULL,
ADD COLUMN     "phosphorus" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "potassium" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recommendations" TEXT[],
ADD COLUMN     "recommendedCrops" TEXT[],
ADD COLUMN     "soilDescription" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SoilAnalysis_userId_idx" ON "SoilAnalysis"("userId");
