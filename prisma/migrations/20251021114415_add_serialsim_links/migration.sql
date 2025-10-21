/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `simNumber` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Inventory_serialNumber_key";

-- DropIndex
DROP INDEX "Inventory_simNumber_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "serialNumber",
DROP COLUMN "simNumber";

-- CreateTable
CREATE TABLE "SerialSim" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "simNumber" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SerialSim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SerialSim_serialNumber_key" ON "SerialSim"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SerialSim_simNumber_key" ON "SerialSim"("simNumber");

-- AddForeignKey
ALTER TABLE "SerialSim" ADD CONSTRAINT "SerialSim_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
