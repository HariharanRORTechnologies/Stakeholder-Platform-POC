import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { ReportService } from '../services/reportService';
import { ReportType } from '../models/Report.model';

export class ReportController {
  private reportService: ReportService;

  constructor(db: Pool) {
    this.reportService = new ReportService(db);
  }

  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const result = await this.reportService.getReports(page, limit);

      res.json({
        success: true,
        data: result.reports,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const report = await this.reportService.getReportById(id);

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = await this.reportService.getAnalyticsDashboard();

      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateEventSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { eventIds, startDate, endDate } = req.body;

      const report = await this.reportService.generateEventSummaryReport(
        eventIds || [],
        new Date(startDate),
        new Date(endDate),
        userId
      );

      res.status(201).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      const { format } = req.body;

      const fileUrl = await this.reportService.exportReport(id, format || 'pdf', userId);

      res.json({
        success: true,
        data: { fileUrl },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      await this.reportService.deleteReport(id, userId, userRole);

      res.json({
        success: true,
        message: 'Report deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}
