import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail')
export class MailJob {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send')
  async send(job: Job<{ to: string; subject: string; text: string }>) {
    await this.mailerService.sendMail({
      to: job.data.to,
      subject: job.data.subject,
      text: job.data.text,
    });
  }
}
