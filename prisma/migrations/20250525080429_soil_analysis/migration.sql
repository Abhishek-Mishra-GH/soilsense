-- CreateTable
CREATE TABLE "SoilAnalysis" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "soilType" TEXT NOT NULL,
    "recommendedCrop" TEXT,
    "n" TEXT NOT NULL,
    "p" TEXT NOT NULL,
    "k" TEXT NOT NULL,
    "pH" TEXT NOT NULL,
    "moisture" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SoilAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SoilAnalysis" ADD CONSTRAINT "SoilAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
