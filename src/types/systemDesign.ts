export type SystemDesignNodeType =
  | 'client'
  | 'dns'
  | 'cdn'
  | 'load_balancer'
  | 'api_gateway'
  | 'microservice'
  | 'cache'
  | 'message_queue'
  | 'sql_database'
  | 'nosql_database'
  | 'blob_storage';

export interface ArchitectureNode {
  id: string;
  type: SystemDesignNodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  technology?: string;
  specs?: string;
}

export interface ArchitectureConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  protocol: 'HTTPS' | 'gRPC' | 'WebSocket' | 'TCP' | 'Pub/Sub' | 'SQL';
  label?: string;
}

export interface SystemDesignBlueprint {
  id: string;
  title: string;
  targetCompany: string;
  difficulty: 'Medium' | 'Hard';
  description: string;
  trafficScale: string;
  keyRequirements: string[];
  bottlenecksAndTradeoffs: string[];
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  deepDiveTopics: { title: string; explanation: string }[];
}

export interface CapacityEstimationInput {
  dauMillion: number;
  readWriteRatio: number; // e.g. 10 means 10:1 read to write
  requestsPerUserPerDay: number;
  avgPayloadKb: number;
  dataRetentionYears: number;
}

export interface CapacityEstimationResult {
  readQps: number;
  writeQps: number;
  peakQps: number;
  incomingBandwidthMbps: number;
  outgoingBandwidthMbps: number;
  dailyStorageGb: number;
  totalStorageTb: number;
  estimatedRedisRamGb: number;
}
