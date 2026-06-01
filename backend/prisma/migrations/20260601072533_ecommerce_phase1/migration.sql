/*
  Warnings:

  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "fabric" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOffer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occasion" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "orderStatus" TEXT NOT NULL DEFAULT 'Pending',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingSettings" (
    "id" TEXT NOT NULL,
    "freeShippingAbove" DOUBLE PRECISION NOT NULL,
    "shippingCharge" DOUBLE PRECISION NOT NULL,
    "codEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL,
    "razorpayKeyId" TEXT,
    "razorpaySecret" TEXT,
    "razorpayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeSettings" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroImage" TEXT,
    "offerBanner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
