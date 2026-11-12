-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "reward_id" UUID,
    "note" TEXT,
    "visited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "cycle" INTEGER NOT NULL,
    "earned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed_at" TIMESTAMPTZ(6),
    "redeemed_by" TEXT,
    "reward_visit_id" UUID,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- CreateIndex
CREATE INDEX "members_created_idx" ON "members"("created_at");

-- CreateIndex
CREATE INDEX "visits_member_idx" ON "visits"("member_id", "visited_at");

-- CreateIndex
CREATE INDEX "visits_visited_idx" ON "visits"("visited_at");

-- CreateIndex
CREATE INDEX "rewards_member_idx" ON "rewards"("member_id", "status");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
