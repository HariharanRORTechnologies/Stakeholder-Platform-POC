import { Pool } from 'mysql2/promise';
import { ReportRepository } from '../repositories/reportRepository';
import { Report, ReportType, AnalyticsDashboard } from '../models/Report.model';
import { NotFoundError, AuthorizationError } from '../errors/AppError';
import { auditLog } from '../utils/auditLog';

export class ReportService {
  private reportRepository: ReportRepository;

  constructor(db: Pool) {
    this.reportRepository = new ReportRepository(db);
  }

  async getReports(page: number = 1, limit: number = 20): Promise<{ reports: Report[]; total: number }> {
    return this.reportRepository.findAll(page, limit);
  }

  async getReportById(id: number): Promise<Report> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new NotFoundError('Report not found');
    }
    return report;
  }

  async generateEventSummaryReport(
    eventIds: number[],
    startDate: Date,
    endDate: Date,
    userId: number
  ): Promise<Report> {
    const report = new Report({
      title: `Event Summary Report - ${new Date().toLocaleDateString()}`,
      type: ReportType.EVENT_SUMMARY,
      generatedBy: userId,
      startDate,
      endDate,
      eventIds,
      status: 'pending',
    });

    const reportId = await this.reportRepository.create(report);

    await auditLog.log({
      userId,
      action: 'report.generated',
      resourceType: 'report',
      resourceId: reportId,
      details: { type: ReportType.EVENT_SUMMARY },
    });

    return this.getReportById(reportId);
  }

  async generateAttendanceReport(eventId: number, userId: number): Promise<Report> {
    const report = new Report({
      title: `Attendance Report - Event ${eventId}`,
      type: ReportType.ATTENDANCE,
      generatedBy: userId,
      startDate: new Date(),
      endDate: new Date(),
      eventIds: [eventId],
      status: 'pending',
    });

    const reportId = await this.reportRepository.create(report);

    await auditLog.log({
      userId,
      action: 'report.generated',
      resourceType: 'report',
      resourceId: reportId,
      details: { type: ReportType.ATTENDANCE, eventId },
    });

    return this.getReportById(reportId);
  }

  async generateRegistrationsReport(eventId: number, userId: number): Promise<Report> {
    const report = new Report({
      title: `Registrations Report - Event ${eventId}`,
      type: ReportType.REGISTRATIONS,
      generatedBy: userId,
      startDate: new Date(),
      endDate: new Date(),
      eventIds: [eventId],
      status: 'pending',
    });

    const reportId = await this.reportRepository.create(report);

    return this.getReportById(reportId);
  }

  async getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
    return {
      totalEvents: 0,
      totalRegistrations: 0,
      totalAttendance: 0,
      averageAttendanceRate: 0,
      topEvents: [],
      recentActivity: [],
    };
  }

  async exportReport(id: number, format: 'pdf' | 'csv' | 'excel', userId: number): Promise<string> {
    const report = await this.getReportById(id);

    if (report.generatedBy !== userId && !(await this.userHasReportAccess(userId))) {
      throw new AuthorizationError('Access denied');
    }

    const fileUrl = `reports/${id}-${Date.now()}.${format}`;

    await this.reportRepository.update(id, { fileUrl, status: 'generated' });

    return fileUrl;
  }

  async deleteReport(id: number, userId: number, userRole: string): Promise<void> {
    const report = await this.getReportById(id);

    if (report.generatedBy !== userId && userRole !== 'admin') {
      throw new AuthorizationError('Can only delete own reports');
    }

    await this.reportRepository.delete(id);

    await auditLog.log({
      userId,
      action: 'report.deleted',
      resourceType: 'report',
      resourceId: id,
    });
  }

  private async userHasReportAccess(userId: number): Promise<boolean> {
    return true;
  }
}
