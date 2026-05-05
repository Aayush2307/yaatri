-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "intentionKey" TEXT NOT NULL,
    "intentionLabel" TEXT NOT NULL,
    "groupSize" INTEGER NOT NULL DEFAULT 1,
    "hasSenior" BOOLEAN NOT NULL DEFAULT false,
    "seniorMode" BOOLEAN NOT NULL DEFAULT false,
    "mobilityNeeds" TEXT[] DEFAULT ARRAY['none']::TEXT[],
    "dietaryPrefs" TEXT[] DEFAULT ARRAY['no_preference']::TEXT[],
    "deviceToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concierge" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "languages" TEXT[],
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "lastMessageToUser" TEXT,

    CONSTRAINT "Concierge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConciergeAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conciergeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConciergeAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConciergeMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conciergeId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConciergeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "intentionKey" TEXT NOT NULL,
    "intentionLabel" TEXT NOT NULL,
    "contextNote" TEXT,
    "duration" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "circuitName" TEXT NOT NULL,
    "departureFrom" TEXT,
    "departureTo" TEXT,
    "muhuratTithi" TEXT,
    "muhuratQuality" TEXT,
    "pilgrims" INTEGER NOT NULL,
    "hasSenior" BOOLEAN NOT NULL DEFAULT false,
    "mobilityNeeds" TEXT[],
    "dietaryPrefs" TEXT[],
    "specialNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "planningProgressPct" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripDocument" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Temple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muhurat" (
    "id" TEXT NOT NULL,
    "templeId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Muhurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT,
    "referenceCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" INTEGER,
    "currency" TEXT DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiCache" (
    "key" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCache_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ConciergeAssignment_userId_key" ON "ConciergeAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Temple_name_location_state_key" ON "Temple"("name", "location", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_referenceCode_key" ON "Booking"("referenceCode");

-- AddForeignKey
ALTER TABLE "ConciergeAssignment" ADD CONSTRAINT "ConciergeAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConciergeAssignment" ADD CONSTRAINT "ConciergeAssignment_conciergeId_fkey" FOREIGN KEY ("conciergeId") REFERENCES "Concierge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConciergeMessage" ADD CONSTRAINT "ConciergeMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConciergeMessage" ADD CONSTRAINT "ConciergeMessage_conciergeId_fkey" FOREIGN KEY ("conciergeId") REFERENCES "Concierge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripDocument" ADD CONSTRAINT "TripDocument_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Muhurat" ADD CONSTRAINT "Muhurat_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
