export interface Alert {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    confidence: number;
    latitude: number;
    longitude: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'NEW' | 'IN PROGRESS' | 'RESOLVED' | 'DISMISSED';
    imageId: string;
}
