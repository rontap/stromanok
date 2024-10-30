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
} & Image;

export class Card {
    private card: CardCtr;

    constructor(card: CardCtr) {
        this.card = card;
    }
}