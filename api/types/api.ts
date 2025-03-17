import type { AISession, User } from "@gadget-client/shapesplosion";

/**
 * Represents common filter operations for queries
 */
export type FilterOperations<T> = {
  equals?: T;
  notEquals?: T;
  in?: T[];
  notIn?: T[];
  lessThan?: T;
  lessThanOrEqual?: T;
  greaterThan?: T;
  greaterThanOrEqual?: T;
  isSet?: boolean;
};

/**
 * Represents string-specific filter operations
 */
export type StringFilterOperations = FilterOperations<string> & {
  startsWith?: string;
};

/**
 * Represents date filter operations
 */
export type DateFilterOperations = FilterOperations<string> & {
  before?: string;
  after?: string;
};

/**
 * Represents JSON filter operations
 */
export type JSONFilterOperations = FilterOperations<any> & {
  matches?: Record<string, any>;
};

/**
 * Represents pagination parameters
 */
export type PaginationParams = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
};

/**
 * Represents selection fields
 */
export type SelectionSet<T> = {
  [K in keyof T]?: boolean | Record<string, any>;
};

/**
 * Represents sorting parameters
 */
export type SortParams<T> = {
  [K in keyof T]?: "Ascending" | "Descending";
} | Array<{
  [K in keyof T]?: "Ascending" | "Descending";
}>;

/**
 * Represents filter parameters for the AISession model
 */
export type AISessionFilter = {
  id?: StringFilterOperations;
  clientId?: StringFilterOperations;
  createdAt?: DateFilterOperations;
  updatedAt?: DateFilterOperations;
  lastInteraction?: DateFilterOperations;
  expiresAt?: DateFilterOperations;
  chatHistory?: JSONFilterOperations;
  userId?: StringFilterOperations;
  AND?: AISessionFilter[];
  OR?: AISessionFilter[];
};

/**
 * Represents parameters for finding AISession records
 */
export type FindAISessionParams = PaginationParams & {
  filter?: AISessionFilter;
  sort?: SortParams<AISession>;
  select?: SelectionSet<AISession>;
};

/**
 * Represents parameters for creating an AISession
 */
export type CreateAISessionParams = {
  clientId?: string;
  expiresAt?: string;
  lastInteraction?: string;
  chatHistory?: any;
  user?: { _link: string } | null;
  select?: SelectionSet<AISession>;
};

/**
 * Represents parameters for updating an AISession
 */
export type UpdateAISessionParams = {
  clientId?: string;
  expiresAt?: string;
  lastInteraction?: string;
  chatHistory?: any;
  user?: { _link: string } | null;
  select?: SelectionSet<AISession>;
};

/**
 * Represents the edge structure in paginated results
 */
export type Edge<T> = {
  node: T;
  cursor: string;
};

/**
 * Represents pagination info
 */
export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

/**
 * Represents paginated results
 */
export type Connection<T> = {
  edges: Edge<T>[];
  pageInfo: PageInfo;
};

/**
 * Represents the API interface for AISession model
 */
export interface AISessionAPI {
  findOne: (id: string, options?: { select?: SelectionSet<AISession> }) => Promise<AISession>;
  findMany: (params?: FindAISessionParams) => Promise<AISession[]>;
  findFirst: (params?: FindAISessionParams) => Promise<AISession | null>;
  create: (params: CreateAISessionParams) => Promise<AISession>;
  update: (id: string, params: UpdateAISessionParams) => Promise<AISession>;
  delete: (id: string, options?: { select?: SelectionSet<AISession> }) => Promise<AISession>;
}

/**
 * Represents the full API client interface
 */
export interface APIClient {
  aiSession: AISessionAPI;
  user: {
    findOne: (id: string, options?: { select?: SelectionSet<User> }) => Promise<User>;
    findMany: (params?: any) => Promise<User[]>;
    findFirst: (params?: any) => Promise<User | null>;
    // Additional user methods would go here
  };
  // Add other models as needed
}