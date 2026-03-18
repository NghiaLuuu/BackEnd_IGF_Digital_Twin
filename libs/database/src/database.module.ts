import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PRISMA_CLIENT } from './database.constants';
import { PrismaService } from './prisma.service';

declare const process: {
  env: Record<string, string | undefined>;
};

type PrismaClientLike = {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
};

type PrismaClientConstructor<TClient extends PrismaClientLike> = new (
  ...args: any[]
) => TClient;

@Module({})
export class DatabaseModule {
  static forRoot<TClient extends PrismaClientLike>(
    prismaClient: PrismaClientConstructor<TClient>,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: PRISMA_CLIENT,
          useFactory: () => {
            const connectionString = process.env.DATABASE_URL;

            if (!connectionString) {
              throw new Error('Missing DATABASE_URL environment variable');
            }

            return new prismaClient({
              adapter: new PrismaPg({ connectionString }),
            });
          },
        },
        PrismaService,
      ],
      exports: [PrismaService],
    };
  }
}
