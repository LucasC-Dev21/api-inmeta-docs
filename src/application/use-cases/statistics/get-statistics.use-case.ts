import { Inject, Injectable } from '@nestjs/common';
import type { StatisticsRepository } from '../../../domain/repositories/statistics.repository';
import { STATISTICS_REPOSITORY } from '../../../shared/constants/repository.tokens';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    const [completionRate, mostPending, lastSubmissions] = await Promise.all([
      this.statisticsRepository.getCompletionRate(),
      this.statisticsRepository.getMostPendingDocumentTypes(),
      this.statisticsRepository.getLastSubmissions(),
    ]);

    return {
      completionRate: `${completionRate}%`,
      mostPendingDocumentTypes: mostPending,
      lastSubmissions,
    };
  }
}
