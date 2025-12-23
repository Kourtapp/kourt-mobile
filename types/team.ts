export interface Team {
    id: string;
    name: string;
    sport: string;
    description?: string;
    avatar_url?: string;
    cover_url?: string;
    captain_id: string;
    created_at: string;
    member_count: number;
    stats: {
        wins: number;
        losses: number;
        draws: number;
        matches: number;
        rating: number; // Elo rating for the team
    };
    members?: TeamMember[]; // Optional, fetched on details
}

export interface TeamMember {
    user_id: string;
    team_id: string;
    role: 'captain' | 'admin' | 'member';
    joined_at: string;
    profile: {
        id: string;
        name: string;
        avatar_url?: string;
        username?: string;
    };
}

export interface CreateTeamDTO {
    name: string;
    sport: string;
    description?: string;
    avatar_url?: string;
}
