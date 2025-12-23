import { useState, useEffect } from 'react';
import { MatchService } from '../services/matchService';

export function useMatch(id: string) {
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatch = async () => {
        if (!id) return;
        setLoading(true);
        const result = await MatchService.getMatchDetails(id);
        if (result.success) {
            setMatch((result as any).match || result.data);
            setError(null);
        } else {
            setError(result.error || 'Failed to load match');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMatch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        match,
        loading,
        error,
        refetch: fetchMatch
    };
}
