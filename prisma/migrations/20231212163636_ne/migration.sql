-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('default', 'created');

-- CreateTable
CREATE TABLE "Stage" (
    "projectID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StageType" NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("projectID","name")
);

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
