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

type DatabaseModuleOptions = {
  envKeys?: string[];
};

@Module({})
export class DatabaseModule {
  static forRoot<TClient extends PrismaClientLike>(
    prismaClient: PrismaClientConstructor<TClient>,
    options?: DatabaseModuleOptions,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: PRISMA_CLIENT,
          useFactory: () => {
            const envKeys = options?.envKeys ?? ['DATABASE_URL'];
            const connectionString = envKeys
              .map((key) => process.env[key])
              .find((value) => Boolean(value));

            if (!connectionString) {
              throw new Error(
                `Missing database environment variable. Checked: ${envKeys.join(', ')}`,
              );
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
