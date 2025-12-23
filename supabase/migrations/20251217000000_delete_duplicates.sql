-- Delete duplicate courts (keeping the oldest of each group)
DELETE FROM courts WHERE id IN (
    'ef9d8a0c-c3c8-443e-bf12-d789ab7c0ca5',  -- Quadra teste (mais novo)
    '46d96db9-cf46-41be-8e78-2ee8f22171c8'   -- Teste (mais novo)
);
