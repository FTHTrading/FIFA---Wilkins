/**
 * @wilkins/auth — Role models, access policies, auth utilities
 *
 * Infrastructure color: n/a (cross-cutting)
 */

// ─── Roles ──────────────────────────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'TRANSLATOR_REVIEWER'
  | 'STAFF'
  | 'SPONSOR_MANAGER'
  | 'GUEST';

export interface RolePermissions {
  role: UserRole;
  canManageEvents: boolean;
  canManageVenues: boolean;
  canManagePOIs: boolean;
  canReviewTranslations: boolean;
  canManageCampaigns: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canManageEmergency: boolean;
  canRespondToAssistance: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    canManageEvents: true,
    canManageVenues: true,
    canManagePOIs: true,
    canReviewTranslations: true,
    canManageCampaigns: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canManageEmergency: true,
    canRespondToAssistance: true,
  },
  ADMIN: {
    role: 'ADMIN',
    canManageEvents: true,
    canManageVenues: true,
    canManagePOIs: true,
    canReviewTranslations: true,
    canManageCampaigns: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canManageEmergency: true,
    canRespondToAssistance: true,
  },
  EDITOR: {
    role: 'EDITOR',
    canManageEvents: false,
    canManageVenues: true,
    canManagePOIs: true,
    canReviewTranslations: true,
    canManageCampaigns: false,
    canViewAnalytics: true,
    canManageUsers: false,
    canManageEmergency: false,
    canRespondToAssistance: false,
  },
  TRANSLATOR_REVIEWER: {
    role: 'TRANSLATOR_REVIEWER',
    canManageEvents: false,
    canManageVenues: false,
    canManagePOIs: false,
    canReviewTranslations: true,
    canManageCampaigns: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canManageEmergency: false,
    canRespondToAssistance: false,
  },
  STAFF: {
    role: 'STAFF',
    canManageEvents: false,
    canManageVenues: false,
    canManagePOIs: false,
    canReviewTranslations: false,
    canManageCampaigns: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canManageEmergency: false,
    canRespondToAssistance: true,
  },
  SPONSOR_MANAGER: {
    role: 'SPONSOR_MANAGER',
    canManageEvents: false,
    canManageVenues: false,
    canManagePOIs: false,
    canReviewTranslations: false,
    canManageCampaigns: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canManageEmergency: false,
    canRespondToAssistance: false,
  },
  GUEST: {
    role: 'GUEST',
    canManageEvents: false,
    canManageVenues: false,
    canManagePOIs: false,
    canReviewTranslations: false,
    canManageCampaigns: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canManageEmergency: false,
    canRespondToAssistance: false,
  },
};

/** Check if a role has a specific permission */
export function hasPermission(
  role: UserRole,
  permission: keyof Omit<RolePermissions, 'role'>,
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}
