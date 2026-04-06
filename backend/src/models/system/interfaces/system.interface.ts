export interface ISystemSnapshot {
  cpuUsage: number;
  ramFree: number;
  diskSpace: number;
  networkMs: number;
  uptimePerc: number;
  updatedAt: string;
}

export interface ISystemLogItem {
  type: 'Info' | 'Warning';
  title: string;
  time: string;
  status: 'Success' | 'Warning';
}

export interface ISystemStatsResponse {
  success: boolean;
  data: {
    system: ISystemSnapshot;
    history: ISystemSnapshot[];
    auditLogs: ISystemLogItem[];
  };
}
