import { Pool, PoolConnection, QueryError } from 'mysql2/promise';
import { logger } from '../utils/logger';
import { AppError } from '../errors/AppError';

export class BaseRepository {
  constructor(protected db: Pool) {}

  protected async query<T = any>(
    sql: string,
    values?: any[],
    connection?: PoolConnection
  ): Promise<T[]> {
    const executor = connection || this.db;

    try {
      const [rows] = await executor.execute(sql, values);
      return rows as T[];
    } catch (error) {
      logger.error(`Database query error: ${sql}`, { error, values });
      throw this.handleDatabaseError(error as QueryError);
    }
  }

  protected async queryOne<T = any>(
    sql: string,
    values?: any[],
    connection?: PoolConnection
  ): Promise<T | null> {
    const results = await this.query<T>(sql, values, connection);
    return results.length > 0 ? results[0] : null;
  }

  protected async execute(
    sql: string,
    values?: any[],
    connection?: PoolConnection
  ): Promise<{ affectedRows: number; insertId: number }> {
    const executor = connection || this.db;

    try {
      const [result] = await executor.execute(sql, values);
      return {
        affectedRows: (result as any).affectedRows || 0,
        insertId: (result as any).insertId || 0,
      };
    } catch (error) {
      logger.error(`Database execute error: ${sql}`, { error, values });
      throw this.handleDatabaseError(error as QueryError);
    }
  }

  protected async beginTransaction(connection: PoolConnection): Promise<void> {
    try {
      await connection.beginTransaction();
    } catch (error) {
      logger.error('Failed to begin transaction', { error });
      throw new AppError('Failed to begin database transaction', 500);
    }
  }

  protected async commit(connection: PoolConnection): Promise<void> {
    try {
      await connection.commit();
    } catch (error) {
      logger.error('Failed to commit transaction', { error });
      throw new AppError('Failed to commit transaction', 500);
    }
  }

  protected async rollback(connection: PoolConnection): Promise<void> {
    try {
      await connection.rollback();
    } catch (error) {
      logger.error('Failed to rollback transaction', { error });
    }
  }

  protected async getConnection(): Promise<PoolConnection> {
    try {
      return await this.db.getConnection();
    } catch (error) {
      logger.error('Failed to get database connection', { error });
      throw new AppError('Failed to establish database connection', 500);
    }
  }

  private handleDatabaseError(error: QueryError): AppError {
    if (error.code === 'ER_DUP_ENTRY') {
      return new AppError('This record already exists', 409);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_ROW_IS_REFERENCED') {
      return new AppError('Invalid reference or dependent records exist', 409);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return new AppError('Referenced record not found', 404);
    }

    return new AppError('Database operation failed', 500);
  }
}
