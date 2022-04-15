-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);
