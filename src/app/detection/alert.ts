export interface Alert {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    confidence: number;
    latitude: number;
    longitude: number;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'New' | 'In Progress' | 'Resolved' | 'Dismissed';
    imageId: string;
}
