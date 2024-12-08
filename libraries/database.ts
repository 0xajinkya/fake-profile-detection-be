import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type IPrismaTransaction =
  | typeof prisma
  | Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;

export interface IPrismaOptions {
    transaction?: IPrismaTransaction;
}

const getTransaction = (options?: IPrismaOptions) => {
    if (options?.transaction) {
        return options.transaction;
    }
    return database.instance;
};

const Loader = async () => {
    database.instance = new PrismaClient();
    await database.instance.$connect();
    console.log("🚀 Database connected");
};

export const database = {
    instance: null as PrismaClient | null,
    Loader,
    getTransaction
}