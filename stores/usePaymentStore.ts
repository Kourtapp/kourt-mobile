import { create } from 'zustand';

export interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
}

interface PaymentStore {
    selectedCard: PaymentMethod | null;
    cards: PaymentMethod[];

    setSelectedCard: (card: PaymentMethod | null) => void;
    addCard: (card: PaymentMethod) => void;
    removeCard: (cardId: string) => void;
}

const MOCK_CARDS: PaymentMethod[] = [
    { id: '1', brand: 'Mastercard', last4: '4242', expiry: '12/25' },
    { id: '2', brand: 'Visa', last4: '1234', expiry: '10/26' },
];

export const usePaymentStore = create<PaymentStore>((set) => ({
    selectedCard: MOCK_CARDS[0],
    cards: MOCK_CARDS,

    setSelectedCard: (card) => set({ selectedCard: card }),
    addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
    removeCard: (cardId) => set((state) => ({
        cards: state.cards.filter(c => c.id !== cardId),
        selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard
    })),
}));
