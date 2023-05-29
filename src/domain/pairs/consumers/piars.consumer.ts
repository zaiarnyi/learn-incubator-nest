import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { PairsEntity } from '../entity/pairs.entity';
import { Inject, Logger } from '@nestjs/common';
import { PairProcess } from '../services/pair.process';

@Processor('pairs')
export class PiarsConsumer {
  private readonly logger = new Logger(PiarsConsumer.name);
  constructor(@Inject(PairProcess) private readonly process: PairProcess) {}
  @OnQueueActive()
  onActive(job: Job<PairsEntity>) {
    this.logger.warn(`Processing job ${job.id} of type ${job.name}...`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<PairsEntity>) {
    this.logger.warn(`Finished processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  async onFailed(job: Job<PairsEntity>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @OnQueueStalled()
  async onStall(job: Job<PairsEntity>) {
    this.logger.warn(`Stalled job ${job.id} of type ${job.name}`);
  }

  @OnQueueCleaned()
  async onCleaned() {
    this.logger.warn(`Queue is cleaned`);
  }

  @Process({ name: 'finish' })
  async finish(job: Job<{ pairId: number }>) {
    await this.process.execute(job.data);
  }
}
