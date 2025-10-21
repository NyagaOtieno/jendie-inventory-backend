/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `serialNumber` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simNumber` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_userId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "updatedAt",
ADD COLUMN     "isDirectSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "negotiatedPrice" DOUBLE PRECISION,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "simNumber" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
