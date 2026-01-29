export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'me'] as const,
  },
  // Example for future domains
  // users: {
  //   all: ['users'] as const,
  //   lists: () => [...queryKeys.users.all, 'list'] as const,
  //   list: (filters: any) => [...queryKeys.users.lists(), { filters }] as const,
  //   details: () => [...queryKeys.users.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.users.details(), id] as const,
  // },
  organization: {
    all: ['organization'] as const,
    list: (params?: any) => [...queryKeys.organization.all, 'list', ...(params ? [params] : [])] as const,
    detail: () => [...queryKeys.organization.all, 'detail'] as const,
    stats: () => [...queryKeys.organization.all, 'stats'] as const,
  },
  proposal: {
    all: ['proposal'] as const,
    list: (params?: any) => [...queryKeys.proposal.all, 'list', ...(params ? [params] : [])] as const,
    detail: () => [...queryKeys.proposal.all, 'detail'] as const,
  },
};
