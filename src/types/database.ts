export type WorkspaceRole = "owner" | "admin" | "member";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Workspace = {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
};

export type Website = {
  id: string;
  workspace_id: string;
  name: string;
  url: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type GscConnectionStatus = "pending_property" | "connected" | "error";

export type GscConnection = {
  id: string;
  website_id: string;
  workspace_id: string;
  connected_by: string;
  property_uri: string | null;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  status: GscConnectionStatus;
  last_error: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Safe fields for client UI (no tokens). */
export type GscConnectionPublic = {
  id: string;
  website_id: string;
  workspace_id: string;
  property_uri: string | null;
  status: GscConnectionStatus;
  last_error: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BingConnectionStatus = "pending_property" | "connected" | "error";

export type BingConnection = {
  id: string;
  website_id: string;
  workspace_id: string;
  connected_by: string;
  property_uri: string | null;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  status: BingConnectionStatus;
  last_error: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Safe fields for client UI (no tokens). */
export type BingConnectionPublic = {
  id: string;
  website_id: string;
  workspace_id: string;
  property_uri: string | null;
  status: BingConnectionStatus;
  last_error: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TrendDirection = "rising" | "stable" | "falling" | "unknown";

export type TrendOpportunityStatus = "open" | "done" | "dismissed";

export type ProjectTrend = {
  id: string;
  website_id: string;
  workspace_id: string;
  keyword: string;
  interest_score: number;
  trend_direction: TrendDirection;
  related_queries: unknown;
  related_topics: unknown;
  interest_over_time: unknown;
  interest_by_region: unknown;
  region: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TrendOpportunity = {
  id: string;
  website_id: string;
  workspace_id: string;
  keyword: string;
  reason: string;
  trend_score: number;
  status: TrendOpportunityStatus;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: Workspace;
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: WorkspaceMember;
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role: WorkspaceRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: WorkspaceRole;
          created_at?: string;
        };
        Relationships: [];
      };
      websites: {
        Row: Website;
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          url: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          url?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gsc_connections: {
        Row: GscConnection;
        Insert: {
          id?: string;
          website_id: string;
          workspace_id: string;
          connected_by: string;
          property_uri?: string | null;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          status?: GscConnectionStatus;
          last_error?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          workspace_id?: string;
          connected_by?: string;
          property_uri?: string | null;
          access_token?: string;
          refresh_token?: string;
          token_expires_at?: string;
          status?: GscConnectionStatus;
          last_error?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bing_connections: {
        Row: BingConnection;
        Insert: {
          id?: string;
          website_id: string;
          workspace_id: string;
          connected_by: string;
          property_uri?: string | null;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          status?: BingConnectionStatus;
          last_error?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          workspace_id?: string;
          connected_by?: string;
          property_uri?: string | null;
          access_token?: string;
          refresh_token?: string;
          token_expires_at?: string;
          status?: BingConnectionStatus;
          last_error?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_trends: {
        Row: ProjectTrend;
        Insert: {
          id?: string;
          website_id: string;
          workspace_id: string;
          keyword: string;
          interest_score?: number;
          trend_direction?: TrendDirection;
          related_queries?: unknown;
          related_topics?: unknown;
          interest_over_time?: unknown;
          interest_by_region?: unknown;
          region?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          workspace_id?: string;
          keyword?: string;
          interest_score?: number;
          trend_direction?: TrendDirection;
          related_queries?: unknown;
          related_topics?: unknown;
          interest_over_time?: unknown;
          interest_by_region?: unknown;
          region?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trend_opportunities: {
        Row: TrendOpportunity;
        Insert: {
          id?: string;
          website_id: string;
          workspace_id: string;
          keyword: string;
          reason: string;
          trend_score?: number;
          status?: TrendOpportunityStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          workspace_id?: string;
          keyword?: string;
          reason?: string;
          trend_score?: number;
          status?: TrendOpportunityStatus;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string };
        Returns: boolean;
      };
      is_email_allowed: {
        Args: { check_email: string };
        Returns: boolean;
      };
      bootstrap_user_account: {
        Args: Record<string, never>;
        Returns: Workspace;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
