/*
  Warnings:

  - Changed the type of `product_price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "product_price",
ADD COLUMN     "product_price" DECIMAL(65,30) NOT NULL;
