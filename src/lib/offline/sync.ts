import { createClient } from '@/lib/supabase/client';
import { offlineDb, getLastSyncTime, setLastSyncTime } from './db';
import { SyncQueueItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface SyncResult {
    success: boolean;
    synced: number;
    failed: number;
    errors: string[];
}

// Check if online
export function isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
}

// Create sync queue item
export async function queueForSync(
    entityType: string,
    entityId: string,
    action: 'create' | 'update' | 'delete',
    data: Record<string, any>
): Promise<void> {
    await offlineDb.syncQueue.add({
        id: uuidv4(),
        entity_type: entityType,
        entity_id: entityId,
        action,
        data,
        status: 'pending',
        retry_count: 0,
        created_at: new Date().toISOString(),
    });
}

// Process sync queue
export async function processSyncQueue(): Promise<SyncResult> {
    if (!isOnline()) {
        return { success: false, synced: 0, failed: 0, errors: ['Device is offline'] };
    }

    const supabase = createClient();
    const pendingItems = await offlineDb.syncQueue
        .where('status')
        .equals('pending')
        .toArray();

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of pendingItems) {
        try {
            await syncItem(supabase, item);
            await offlineDb.syncQueue.update(item.id!, {
                status: 'synced',
                synced_at: new Date().toISOString(),
            });
            synced++;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`${item.entity_type}/${item.entity_id}: ${errorMessage}`);

            const newRetryCount = (item.retry_count || 0) + 1;
            if (newRetryCount >= 3) {
                await offlineDb.syncQueue.update(item.id!, {
                    status: 'failed',
                    retry_count: newRetryCount,
                    error: errorMessage,
                });
            } else {
                await offlineDb.syncQueue.update(item.id!, {
                    retry_count: newRetryCount,
                    error: errorMessage,
                });
            }
            failed++;
        }
    }

    return { success: failed === 0, synced, failed, errors };
}

// Sync individual item
async function syncItem(
    supabase: ReturnType<typeof createClient>,
    item: SyncQueueItem
): Promise<void> {
    const { entity_type, entity_id, action, data } = item;

    switch (action) {
        case 'create':
            const { error: createError } = await supabase
                .from(entity_type)
                .insert(data);
            if (createError) throw new Error(createError.message);
            break;

        case 'update':
            const { error: updateError } = await supabase
                .from(entity_type)
                .update(data)
                .eq('id', entity_id);
            if (updateError) throw new Error(updateError.message);
            break;

        case 'delete':
            const { error: deleteError } = await supabase
                .from(entity_type)
                .delete()
                .eq('id', entity_id);
            if (deleteError) throw new Error(deleteError.message);
            break;
    }
}

// Sync cached data from server
export async function syncFromServer(orgId: string): Promise<SyncResult> {
    if (!isOnline()) {
        return { success: false, synced: 0, failed: 0, errors: ['Device is offline'] };
    }

    const supabase = createClient();
    let synced = 0;
    const errors: string[] = [];

    // Sync beneficiaries
    try {
        const lastSync = await getLastSyncTime('beneficiaries');
        let query = supabase
            .from('beneficiaries_individual')
            .select('*')
            .eq('org_id', orgId);

        if (lastSync) {
            query = query.gte('updated_at', lastSync.toISOString());
        }

        const { data: beneficiaries, error } = await query;
        if (error) throw new Error(error.message);

        if (beneficiaries) {
            await offlineDb.beneficiaries.bulkPut(beneficiaries);
            synced += beneficiaries.length;
        }
        await setLastSyncTime('beneficiaries', new Date());
    } catch (error) {
        errors.push(`beneficiaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Sync households
    try {
        const lastSync = await getLastSyncTime('households');
        let query = supabase
            .from('beneficiaries_household')
            .select('*')
            .eq('org_id', orgId);

        if (lastSync) {
            query = query.gte('updated_at', lastSync.toISOString());
        }

        const { data: households, error } = await query;
        if (error) throw new Error(error.message);

        if (households) {
            await offlineDb.households.bulkPut(households);
            synced += households.length;
        }
        await setLastSyncTime('households', new Date());
    } catch (error) {
        errors.push(`households: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Sync projects
    try {
        const lastSync = await getLastSyncTime('projects');
        let query = supabase
            .from('projects')
            .select('*')
            .eq('org_id', orgId);

        if (lastSync) {
            query = query.gte('updated_at', lastSync.toISOString());
        }

        const { data: projects, error } = await query;
        if (error) throw new Error(error.message);

        if (projects) {
            await offlineDb.projects.bulkPut(projects);
            synced += projects.length;
        }
        await setLastSyncTime('projects', new Date());
    } catch (error) {
        errors.push(`projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Sync activities
    try {
        const lastSync = await getLastSyncTime('activities');
        let query = supabase
            .from('activities')
            .select('*')
            .eq('org_id', orgId);

        if (lastSync) {
            query = query.gte('updated_at', lastSync.toISOString());
        }

        const { data: activities, error } = await query;
        if (error) throw new Error(error.message);

        if (activities) {
            await offlineDb.activities.bulkPut(activities);
            synced += activities.length;
        }
        await setLastSyncTime('activities', new Date());
    } catch (error) {
        errors.push(`activities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { success: errors.length === 0, synced, failed: errors.length, errors };
}

// Get pending sync count
export async function getPendingSyncCount(): Promise<number> {
    return offlineDb.syncQueue.where('status').equals('pending').count();
}

// Clear failed items from queue
export async function clearFailedSyncItems(): Promise<void> {
    await offlineDb.syncQueue.where('status').equals('failed').delete();
}

// Retry failed items
export async function retryFailedSyncItems(): Promise<void> {
    await offlineDb.syncQueue
        .where('status')
        .equals('failed')
        .modify({ status: 'pending', retry_count: 0, error: undefined });
}
