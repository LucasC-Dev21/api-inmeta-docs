export interface StatisticsRepository {
  getCompletionRate(): Promise<number>;
  getMostPendingDocumentTypes(): Promise<
    { documentTypeId: string; name: string; count: number }[]
  >;
  getLastSubmissions(): Promise<
    {
      documentId: string;
      collaboratorId: string;
      collaboratorName: string;
      documentTypeName: string;
      fileName: string;
      submittedAt: Date;
    }[]
  >;
}
