import {Card} from "./Card.tsx";

export const app_version = 1.1;

export class Collection {
    cards: Card[] = [];

    constructor(cards: Card[]) {
        this.cards = cards;
    }

    toJSON() {
        const cardsJSON = this.cards.map(card => card.toJSON());
        const exported = {
            cards: cardsJSON,
            app_version: app_version,
        }
        return JSON.stringify(exported);
    }

    checkErrors() {
        const errors = [];
        const duplicates: Record<string, number> = {};
        this.cards.forEach(card => {
            const item = duplicates[card.card.rank] || 0;
            duplicates[card.card.rank] = item + 1;
        })
        Object.keys(duplicates).forEach((key: string) => {
            if (duplicates[key] > 1) {
                errors.push(`Duplicate Rank: ${key} has ${duplicates[key]} instances`)
            }
        })
    }

    add(cards) {
        this.cards.push(...cards);
    }
}