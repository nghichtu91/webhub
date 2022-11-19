import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './entities';
import { UserService } from './services';
import { UserController } from './controllers';
import { UserSubscriber } from './subscribers';
import { IsUserAlreadyExistConstraint } from './validators/IsUserAlreadyExist';
import { UserPlayTimeModule } from './playtime.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserPlayTimeModule],
  providers: [IsUserAlreadyExistConstraint, UserService, UserSubscriber],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
