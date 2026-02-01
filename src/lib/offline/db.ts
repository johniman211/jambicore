import Dexie, { Table } from 'dexie';
import {
    BeneficiaryIndividual,
    BeneficiaryHousehold,
    Project,
    Activity,
    Distribution,
    SyncQueueItem
} from '@/types';

// Offline database schema
export class JambiOfflineDB extends Dexie {
    // Cached tables (read-only offline)
    beneficiaries!: Table<BeneficiaryIndividual>;
    households!: Table<BeneficiaryHousehold>;
    projects!: Table<Project>;
    activities!: Table<Activity>;

    // Draft tables (can create/edit offline)
    distributionDrafts!: Table<DistributionDraft>;
    fieldNotes!: Table<FieldNote>;

    // Sync queue
    syncQueue!: Table<SyncQueueItem>;

    // Metadata
    syncMeta!: Table<SyncMetadata>;

    constructor() {
        super('jambi-core-offline');

        this.version(1).stores({
            // Cached tables - indexed by id and org_id
            beneficiaries: 'id, org_id, branch_id, office_id, household_id, [org_id+branch_id]',
            households: 'id, org_id, branch_id, office_id, household_id, [org_id+branch_id]',
            projects: 'id, org_id, branch_id, status, [org_id+status]',
            activities: 'id, org_id, project_id, status, [org_id+project_id]',

            // Draft tables - local only
            distributionDrafts: '++localId, id, org_id, project_id, status, created_at',
            fieldNotes: '++localId, id, org_id, entity_type, entity_id, created_at',

            // Sync queue
            syncQueue: '++id, entity_type, entity_id, action, status, created_at',

            // Metadata
            syncMeta: 'key',
        });
    }
}

// Draft types (local only)
export interface DistributionDraft {
    localId?: number;
    id?: string;
    org_id: string;
    project_id: string;
    activity_id?: string;
    branch_id?: string;
    office_id?: string;
    name: string;
    distribution_type: 'item' | 'cash' | 'voucher';
    distribution_date: string;
    location?: string;
    items: DistributionDraftItem[];
    recipients: DistributionDraftRecipient[];
    status: 'draft' | 'ready_to_sync';
    created_at: string;
    updated_at: string;
}

export interface DistributionDraftItem {
    item_name: string;
    quantity: number;
    unit: string;
    unit_value?: number;
    currency?: 'USD' | 'SSP';
}

export interface DistributionDraftRecipient {
    beneficiary_type: 'individual' | 'household';
    beneficiary_id: string;
    beneficiary_name: string;
    received_at?: string;
    notes?: string;
}

export interface FieldNote {
    localId?: number;
    id?: string;
    org_id: string;
    entity_type: 'beneficiary' | 'household' | 'project' | 'activity' | 'distribution';
    entity_id: string;
    title: string;
    content: string;
    created_by: string;
    created_at: string;
    synced_at?: string;
}

export interface SyncMetadata {
    key: string;
    value: any;
    updated_at: string;
}

// Create singleton instance
export const offlineDb = new JambiOfflineDB();

// Helper functions
export async function getLastSyncTime(table: string): Promise<Date | null> {
    const meta = await offlineDb.syncMeta.get(`last_sync_${table}`);
    return meta ? new Date(meta.value) : null;
}

export async function setLastSyncTime(table: string, time: Date): Promise<void> {
    await offlineDb.syncMeta.put({
        key: `last_sync_${table}`,
        value: time.toISOString(),
        updated_at: new Date().toISOString(),
    });
}

export async function clearOfflineData(): Promise<void> {
    await offlineDb.beneficiaries.clear();
    await offlineDb.households.clear();
    await offlineDb.projects.clear();
    await offlineDb.activities.clear();
    await offlineDb.syncMeta.clear();
}

export async function getOfflineStats(): Promise<{
    beneficiaries: number;
    households: number;
    projects: number;
    activities: number;
    distributionDrafts: number;
    fieldNotes: number;
    pendingSync: number;
}> {
    return {
        beneficiaries: await offlineDb.beneficiaries.count(),
        households: await offlineDb.households.count(),
        projects: await offlineDb.projects.count(),
        activities: await offlineDb.activities.count(),
        distributionDrafts: await offlineDb.distributionDrafts.count(),
        fieldNotes: await offlineDb.fieldNotes.count(),
        pendingSync: await offlineDb.syncQueue.where('status').equals('pending').count(),
    };
}
