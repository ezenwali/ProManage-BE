-- CreateTable
CREATE TABLE "ProjectTeam" (
    "projectID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL,

    CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY ("projectID","userID")
);

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
