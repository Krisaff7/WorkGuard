import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const initDB = async (): Promise<SQLite.SQLiteDatabase> => {
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
        const db = await SQLite.openDatabaseAsync('workguard.db');
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                hours REAL NOT NULL,
                type TEXT DEFAULT 'standard'
            );
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);
        console.log('Database initialized');
        return db;
    })();

    return dbPromise;
};

const getDB = async () => {
    return await initDB();
};

export const addLog = async (date: string, hours: number, type: 'standard' | 'manual' = 'standard') => {
    try {
        const db = await getDB();
        await db.runAsync('INSERT INTO logs (date, hours, type) VALUES (?, ?, ?)', date, hours, type);
    } catch (error) {
        console.error('Error adding log:', error);
        throw error;
    }
};

export const deleteLog = async (id: number) => {
    try {
        const db = await getDB();
        await db.runAsync('DELETE FROM logs WHERE id = ?', id);
    } catch (error) {
        console.error('Error deleting log:', error);
        throw error;
    }
};

export const getResetId = async (): Promise<number> => {
    try {
        const db = await getDB();
        const res = await db.getFirstAsync<{ value: string }>(
            'SELECT value FROM settings WHERE key = ?',
            'last_reset_id'
        );
        return res ? parseInt(res.value, 10) || 0 : 0;
    } catch (error) {
        console.error('Error getting reset id:', error);
        return 0;
    }
};

export const resetHoursCounter = async (_year?: number) => {
    try {
        const db = await getDB();
        const maxRes = await db.getFirstAsync<{ maxId: number | null }>(
            'SELECT MAX(id) as maxId FROM logs'
        );
        const lastId = maxRes?.maxId || 0;
        await db.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            'last_reset_id',
            lastId.toString()
        );
    } catch (error) {
        console.error('Error resetting hours counter:', error);
        throw error;
    }
};

export const getAllLogs = async () => {
    try {
        const db = await getDB();
        return await db.getAllAsync<{ id: number; date: string; hours: number; type: string }>(
            'SELECT * FROM logs ORDER BY date DESC, id DESC'
        );
    } catch (error) {
        console.error('Error getting all logs:', error);
        return [];
    }
};

export const getLogs = async (_year?: number) => {
    return await getAllLogs();
};

export const getCurrentMonthTotal = async (year: number, month: number): Promise<number> => {
    try {
        const db = await getDB();
        const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
        const result = await db.getFirstAsync<{ total: number }>(
            'SELECT SUM(hours) as total FROM logs WHERE date LIKE ?',
            `${monthStr}-%`
        );
        return result?.total || 0;
    } catch (error) {
        console.error('Error getting current month total:', error);
        return 0;
    }
};

export const getMonthlyStats = async (year: number) => {
    try {
        const db = await getDB();
        return await db.getAllAsync<{ month: string; total: number }>(
            `SELECT strftime('%m', date) as month, SUM(hours) as total 
             FROM logs 
             WHERE date LIKE ?
             GROUP BY month`,
            `${year}-%`
        );
    } catch (error) {
        console.error('Error getting monthlyStats:', error);
        return [];
    }
};

export const getActiveCycleTotal = async (): Promise<number> => {
    try {
        const db = await getDB();
        const resetId = await getResetId();
        const result = await db.getFirstAsync<{ total: number }>(
            'SELECT SUM(hours) as total FROM logs WHERE id > ?',
            resetId
        );
        return result?.total || 0;
    } catch (error) {
        console.error('Error getting active cycle total:', error);
        return 0;
    }
};

export const clearAllData = async () => {
    try {
        const db = await getDB();
        await db.runAsync('DELETE FROM logs');
        await db.runAsync('DELETE FROM settings');
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
};

export const getAnnualTotal = async (_year?: number) => {
    return await getActiveCycleTotal();
};
