/*
  Warnings:

  - You are about to drop the column `contact` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPrice` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Dealer` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `simCard` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `buyerName` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `buyerType` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `saleDate` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Dealer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Made the column `dealerId` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_inventoryId_fkey";

-- DropIndex
DROP INDEX "Inventory_serialNumber_key";

-- DropIndex
DROP INDEX "Inventory_simCard_key";

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "contact",
DROP COLUMN "defaultPrice",
DROP COLUMN "location",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "model",
DROP COLUMN "purchaseDate",
DROP COLUMN "sellingPrice",
DROP COLUMN "serialNumber",
DROP COLUMN "simCard",
DROP COLUMN "status",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "dealerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "buyerName",
DROP COLUMN "buyerType",
DROP COLUMN "inventoryId",
DROP COLUMN "saleDate",
DROP COLUMN "sellingPrice",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_email_key" ON "Dealer"("email");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
