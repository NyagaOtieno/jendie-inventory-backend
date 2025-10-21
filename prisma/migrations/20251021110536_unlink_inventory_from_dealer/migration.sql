/*
  Warnings:

  - You are about to drop the column `dealerId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serialNumber]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[simNumber]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `model` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simNumber` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_dealerId_fkey";

-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "dealerId",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "simNumber" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "dealerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_serialNumber_key" ON "Inventory"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_simNumber_key" ON "Inventory"("simNumber");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
