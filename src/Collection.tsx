import {Card, CardCtr} from "./Card.tsx";
import {download} from "./utils.ts";

export const app_version = 1.2;

export class Collection {
    cards: Card[] = [];

    constructor(cards: Card[]) {
        this.cards = cards;
    }

    toJSON() {
        const cardsJSON = this.cards.map(card => card.card);
        const exported = {
            cards: cardsJSON,
            app_version: app_version,
        }
        download(
            JSON.stringify(exported),
            `deck-stromanok-.deck${app_version}.json`
        )
    }

    static fromJSON(deck) {

        if (app_version != deck.app_version) {
            if (!window.confirm(`app version mismatch. ${app_version} vs ${deck.app_version}\nCards may not load correctly. Continue?`)) {
                return;
            }
        }
        deck.cards = deck.cards.map((card: CardCtr) => new Card(card));
        return deck;
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