import {Collection} from "./Collection.tsx";
import {Card} from "./Card.tsx";
import {Heading, Text} from "@radix-ui/themes";
import React, {useState} from "react";

type DeckProps = {
    deck: Collection,
    setDeck: (deck: Collection) => void,
    setCard: (card: Card) => void
}
const sortCards = (a, b) => a.card.rank - b.card.rank;
export default function Deck({deck, setCard, setDeck}: DeckProps) {
    const [update, setUpdate] = useState({});
    const handleUpload = (event) => {
        const ourl = URL.createObjectURL(event.target.files[0]);
        fetch(ourl)
            .then(res => res.json())
            .then(json => {
                setDeck(json);
            })
    }
    const addCardsToDeck = async (event) => {
        const results = [];
        await Promise.all([...event.target.files]
            .map(file => new Promise((resolve, _reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    try {
                        resolve(results.push(Card.fromJSON(reader.result)));
                    } catch (err) {
                        // Return a blank value; ignore non-JSON (or do whatever else)
                        console.log('Please use .json!');
                    }
                }
                reader.readAsText(file);
            })));
        console.log(results);
        deck.add(results);
        setUpdate({});
    }
    return <>
        <Heading>Deck</Heading>
        <div className={"grid grid-cols-4 gap-3 w-[1380px]"}>
            {deck.cards.sort(sortCards).map(card => {
                const CardTSX = card.tsx;
                return (<div>
                    <CardTSX card={card}
                             img={card.card.img}/>

                </div>)
            })}
        </div>
        <br/>
        <Heading>Deck</Heading>
        <div className="grid gap-1">
            <Text>Upload Deck</Text>
            <input type="file" accept="application/json" onChange={handleUpload}/>
        </div>
        <div className="grid gap-1">
            <Text>Add Card to Deck</Text>
            <input type="file" accept="application/json" multiple onChange={addCardsToDeck}/>
        </div>
    </>
}