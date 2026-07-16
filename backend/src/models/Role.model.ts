export class Role {
  id: number;
  name: string;
  description?: string;
  level: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Role> = {}) {
    Object.assign(this, data);
  }

  canManageRole(targetRole: Role): boolean {
    return this.level < targetRole.level;
  }

  isHigherLevel(otherLevel: number): boolean {
    return this.level < otherLevel;
  }

  isLowerLevel(otherLevel: number): boolean {
    return this.level > otherLevel;
  }

  canBeModified(): boolean {
    return !this.isSystem;
  }

  canBeDeleted(): boolean {
    return !this.isSystem;
  }
}
