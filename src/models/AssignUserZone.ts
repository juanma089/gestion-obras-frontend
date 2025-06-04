import { WorkZone } from "./WorkZone";

export interface AssignUserZone {
    id: number;
    userId: string;
    workZone: WorkZone;
}

export interface CreateAssignUserZone {
    userId: string;
    zoneId: number;
}

export interface AssignUsersToZoneDto {
  zoneId: number;
  userIds: string[];
}