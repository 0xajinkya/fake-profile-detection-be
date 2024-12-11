-- CreateTable
CREATE TABLE "PredictionPost" (
    "id" TEXT NOT NULL,
    "host" "Host" NOT NULL DEFAULT 'TWITTER',
    "tweet" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "statement" TEXT,
    "label_probability" TEXT DEFAULT 'Disagree',
    "prediction" "PredictionStatus",
    "remarks" TEXT,
    "profileInfo" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredictionPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PredictionPost_id_key" ON "PredictionPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PredictionPost_host_tweet_key" ON "PredictionPost"("host", "tweet");
