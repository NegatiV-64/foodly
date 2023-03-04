-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_order_delivery_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_order_payment_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "order_payment_id" DROP NOT NULL,
ALTER COLUMN "order_delivery_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_payment_id_fkey" FOREIGN KEY ("order_payment_id") REFERENCES "Payment"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_delivery_id_fkey" FOREIGN KEY ("order_delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE SET NULL ON UPDATE CASCADE;
