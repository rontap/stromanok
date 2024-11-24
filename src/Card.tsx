import {download} from "./utils.ts";
import {app_version} from "./Collection.tsx";

type Image = {
    xpos: number;
    ypos: number;
    width: number;
    img: string;
}
export type CardCtr = {
    name: string;
    motto?: string;
    quote?: string;
    effect?: string;
    rank: number;
    chips: string;
    deg: number;
    css: string;
} & Image;

export class Card {
    card: CardCtr;

    constructor(card: CardCtr) {
        this.card = card;
    }

    static toJSON(card: CardCtr): string {
        return JSON.stringify(card)
    }

    static fromJSON(jsonStr: string) {
        try {
            const json = JSON.parse(jsonStr) as CardCtr;
            return new Card(json as CardCtr);

        } catch (e) {
            console.error("MALFORMED JSON", e);
        }
    }

    static download(card: CardCtr) {
        download(
            Card.toJSON(card),
            `stromanok-${card.rank}.str${app_version}.json`
        )
    }

}