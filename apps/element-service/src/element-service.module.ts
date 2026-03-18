import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ELEMENT_REPOSITORY } from './contracts/element-repository.interface';
import { ElementServiceController } from './controllers/element-service.controller';
import { ElementRepository } from './repositories/element.repository';
import { ElementServiceService } from './services/element-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ElementServiceController],
  providers: [
    {
      provide: ELEMENT_REPOSITORY,
      useClass: ElementRepository,
    },
    ElementServiceService,
  ],
})
export class ElementServiceModule {}
