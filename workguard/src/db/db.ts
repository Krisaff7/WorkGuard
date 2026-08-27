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

export const getResetId = async (year: number): Promise<number> => {
    try {
        const db = await getDB();
        const res = await db.getFirstAsync<{ value: string }>(
            'SELECT value FROM settings WHERE key = ?',
            `reset_id_${year}`
        );
        return res ? parseInt(res.value, 10) || 0 : 0;
    } catch (error) {
        console.error('Error getting reset id:', error);
        return 0;
    }
};

export const resetHoursCounter = async (year: number) => {
    try {
        const db = await getDB();
        const maxRes = await db.getFirstAsync<{ maxId: number | null }>(
            'SELECT MAX(id) as maxId FROM logs WHERE date LIKE ?',
            `${year}-%`
        );
        const lastId = maxRes?.maxId || 0;
        await db.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            `reset_id_${year}`,
            lastId.toString()
        );
    } catch (error) {
        console.error('Error resetting hours counter:', error);
        throw error;
    }
};

export const getLogs = async (year: number) => {
    try {
        const db = await getDB();
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        return await db.getAllAsync<{ id: number; date: string; hours: number; type: string }>(
            'SELECT * FROM logs WHERE date BETWEEN ? AND ? ORDER BY date DESC, id DESC',
            start,
            end
        );
    } catch (error) {
        console.error('Error getting logs:', error);
        return [];
    }
};

export const getMonthlyStats = async (year: number) => {
    try {
        const db = await getDB();
        const resetId = await getResetId(year);
        // Return sum grouped by month for the given year since reset
        return await db.getAllAsync<{ month: string; total: number }>(
            `SELECT strftime('%m', date) as month, SUM(hours) as total 
             FROM logs 
             WHERE date LIKE ? AND id > ?
             GROUP BY month`,
            `${year}-%`,
            resetId
        );
    } catch (error) {
        console.error('Error getting monthlyStats:', error);
        return [];
    }
};

export const getAnnualTotal = async (year: number) => {
    try {
        const db = await getDB();
        const resetId = await getResetId(year);
        const result = await db.getFirstAsync<{ total: number }>(
            'SELECT SUM(hours) as total FROM logs WHERE date LIKE ? AND id > ?',
            `${year}-%`,
            resetId
        );
        return result?.total || 0;
    } catch (error) {
        console.error('Error getting annual total:', error);
        return 0;
    }
};
