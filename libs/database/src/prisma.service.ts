import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PRISMA_CLIENT } from './database.constants';

type PrismaClientLike = {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
};

@Injectable()
export class PrismaService<TClient extends PrismaClientLike = PrismaClientLike>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(PRISMA_CLIENT) readonly client: TClient) {}

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
