/*
  Warnings:

  - You are about to drop the column `order_payment_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_order_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_order_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_order_payment_id_fkey";

-- DropIndex
DROP INDEX "Order_order_payment_id_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "order_payment_id";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "payment_order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payment_order_id_key" ON "Payment"("payment_order_id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_order_id_fkey" FOREIGN KEY ("payment_order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
