export enum PermissionCategory {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  EVENTS = 'events',
  REGISTRATIONS = 'registrations',
  FEEDBACK = 'feedback',
  CSR = 'csr',
  VOLUNTEERS = 'volunteers',
  APPROVALS = 'approvals',
  REPORTS = 'reports',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  AUDIT = 'audit',
}

export class Permission {
  id: number;
  name: string;
  description?: string;
  category: PermissionCategory | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Permission> = {}) {
    Object.assign(this, data);
  }

  getDisplayName(): string {
    return this.name.replace(/([._])/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  isInCategory(cat: string): boolean {
    return this.category === cat;
  }
}
