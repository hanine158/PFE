import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BadgeModule } from './badge/badge.module';
import { CoursModule } from './cours/cours.module';
import { ProgressModule } from './progress/progress.module';
import { PdfdocModule } from './pdfdoc/pdfdoc.module';
import { SchemaModule } from './schema/schema.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { AnalyseResModule } from './analyse-res/analyse-res.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EnseignantModule } from './enseignant/enseignant.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port: 5432,
    username: 'postgres',
    password:'hanine',
    database: 'db1',
    entities:[__dirname +'/**/*.entity{.ts,.js}'],
    synchronize:true,
    


  }),
   UserModule, BadgeModule, CoursModule, ProgressModule, PdfdocModule, SchemaModule, QuizModule, QuestionModule, AnalyseResModule, AuthModule , ConfigModule.forRoot({isGlobal:true}),
  MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port:587,
        secure: false, // Use TLS
        tls: {
  rejectUnauthorized: false
},
        auth: {
        from: process.env.MAIL_FROM,
          user: "moussihanine@gmail.com",
          pass: "vwuo nwrc ewfn shnj"
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
  EnseignantModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
