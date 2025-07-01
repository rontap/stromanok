import {download} from "./utils.ts";
import {app_version} from "./Collection.tsx";
import Svg from "./Svg.tsx";
import React from "react";
import './3deffect.css';
import {endRotateToMouse, rotateToMouse} from "./3d.ts";

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
    img: string;
    rankless: boolean;
} & Image;

export class Card {
    card: CardCtr;

    static sample() {
        return new Card(
            {
                name: "Card Name",
                rank: 16,
                xpos: 0,
                ypos: 0,
                width: 0,
                data: "0",
                chips: "Sample, Text",
                deg: 0,
                css: "",
                img: "",
                rankless: false,
            } as CardCtr
        )
    }

    constructor(card?: CardCtr) {
        this.card = card || {
            name: "",
            rank: 16,
            xpos: 0,
            ypos: 0,
            width: 0,
            data: "0",
            chips: "",
            deg: 0,
            css: "",
            img: "",
            rankless: false,

        };
    }

    get name() {
        return this.card.name
    };

    get rank() {
        return this.card.rank
    };

    get xpos() {
        return this.card.xpos
    };

    get ypos() {
        return this.card.ypos
    };

    get width() {
        return this.card.width
    };

    get deg() {
        return this.card.deg
    };

    get chips() {
        return this.card.chips
    };

    get effect() {
        return this.card.effect
    };

    get quote() {
        return this.card.quote
    };

    get motto() {
        return this.card.motto
    };

    get rankless() {
        return this.card.rankless
    };

    static toJSON(card: CardCtr): string {
        return JSON.stringify(card)
    }

    static fromJSON(jsonStr: string) {
        try {
            const json = JSON.parse(jsonStr) as CardCtr;
            return new Card(json.card as CardCtr);

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

    tsx({card, setPartialRaw, drag, startDrag, endDrag, img, onClick, interact}: { card: Card, interact: boolean }) {
        startDrag = startDrag ?? (() => console.log('>>?'));
        endDrag = endDrag ?? (() => false);
        drag = drag ?? (() => false);
        return <>
            <div className={`mt-0 cardOuter card card-id-${card.rank}`}

            //      onMouseEnter={rotateToMouse(card)}
            //      onMouseMove={rotateToMouse(card)}
            //      onMouseLeave={endRotateToMouse(card)}
            >
                <div className={"aCard"}>

                    <div className="svgCtr">
                        <Svg card={card}
                             rankless={card.rankless}
                             setPartialRaw={setPartialRaw}/>
                    </div>
                    <div className={"aCardDyn"}>
                        <div className="imgCtr">
                            <img id={"img"} alt={'lolimg'}
                                 onDragStart={startDrag}
                                 onDrag={drag}
                                 onDragEnd={endDrag}

                                 style={{
                                     width: (100 + card.width) + "%",
                                     maxWidth: (100 + card.width) + "%",
                                     marginLeft: (-card.xpos) + "px",
                                     marginTop: (-card.ypos) + "px",
                                     transform: `rotate(${card.deg}deg)`
                                 }}
                                 src={img || card.card.img}/>
                        </div>

                        <div className={"cardName"}>{card.name}</div>
                        <div className={"cardMCE"}>
                            <b>{card.effect}</b>
                            <div>{card.motto}</div>
                            {card.quote && <i>{card.quote}</i>}
                        </div>

                        <div className={"cardChips"}>{card.chips.split(",").map(chip => <span
                            className={"chip"}>{chip}</span>)}</div>

                        {!card.rankless && <div className={"cardRank"}>{card.rank}</div>}
                    </div>
                </div>
                {interact &&
                    <div className={"glow"} onClick={onClick ?? onClick}>&nbsp;</div>}
            </div>
        </>
    }

}