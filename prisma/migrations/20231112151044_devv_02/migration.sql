-- CreateTable
CREATE TABLE "Tag" (
    "projectID" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("projectID","tagName")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
