import { Controller, Get } from '@nestjs/common';
import { GetStatisticsUseCase } from '../../application/use-cases/statistics/get-statistics.use-case';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

  @Get()
  get() {
    return this.getStatisticsUseCase.execute();
  }
}
