-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PaymentSettings" ADD COLUMN     "razorpayMode" TEXT NOT NULL DEFAULT 'test';
