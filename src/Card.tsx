type Image = {
    xpos: number;
    ypos: number;
    width: number;
    data: string;
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

    toJSON(): string {
        return JSON.stringify(this.card)
    }

    static fromJSON(jsonStr: string) {
        try {
            const json = JSON.parse(jsonStr) as CardCtr;
            return new Card(json as CardCtr);

        } catch (e) {
            console.error("MALFORMED JSON", e);
        }
    }

}