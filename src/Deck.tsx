import {Collection} from "./Collection.tsx";
import {Card} from "./Card.tsx";
import {Button, Card as CardRadix, Flex, Heading, Spinner, Text} from "@radix-ui/themes";
import React, {useState} from "react";

enum JSONType {
    CARD,
    DECK,
    INVALID
};
const inferType = (json) => {
    if (json.card) {
        return JSONType.CARD;
    }
    if (json.cards) {
        return JSONType.DECK;
    }
    return JSONType.INVALID
}
type DeckProps = {
    deck: Collection,
    setDeck: (deck: (deck) => any) => void,
    setCardIndex: (cardNumber: number) => void
    setTab: (newTab: string) => void
}
const sortCards = (a, b) => a.card.rank - b.card.rank;
export default function Deck({deck, setCardIndex, setDeck, setTab}: DeckProps) {
    const [update, setUpdate] = useState({});
    const [load, setLoad] = useState(false);
    const handleUpload = (event) => {
        setLoad(true);
        const ourl = URL.createObjectURL(event.target.files[0]);
        fetch(ourl)
            .then(res => res.json())
            .then(json => {
                if (inferType(json) !== JSONType.DECK) {
                    alert("This does not seem to be a deck.")
                    throw Error("");
                }
                const newDeck = Collection.fromJSON(json)
                setDeck(new Collection(newDeck.cards));
                setUpdate({});
            })
            .finally(() => {
                setLoad(false);
            })
    }
    const addCard = () => {
        deck.add([Card.sample()]);
        setUpdate({});
    }
    const addCardsToDeck = async (event) => {
        const results = [];
        await Promise.all([...event.target.files]
            .map(file => new Promise((resolve, _reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    try {
                        if (inferType(JSON.parse(reader.result)) !== JSONType.CARD) {
                            alert("This does not seem to be a card.")
                            throw Error("");
                        }
                        resolve(results.push(Card.fromJSON(reader.result)));
                    } catch (err) {
                        // Return a blank value; ignore non-JSON (or do whatever else)
                        console.log('Please use .json!');
                    }
                }
                reader.readAsText(file);
            })));
        deck.add(results);
        setUpdate({});
    }
    const deleteDeck = () => {
        if (window.confirm("Do you want to delete all cards in the deck? This action cannot be undone.")) {
            deck.cards = [];
            setUpdate({});
        }

    }
    return <div className={"mt-20 block absolute top-0 left-0 right-0 print:mt-0"}>

        <div className={"print:!hidden"}>
            <Heading>Deck{deck.cards.length > 0 ? `: ${deck.cards.length} Cards` : ' is empty'} / 35 Cards</Heading>
            <br/>
            <CardRadix className={"p-3 bg-border print:hide "}>
                <Heading>Actions</Heading>
                <div className={"grid gap-3 grid-cols-5 items-end"}>
                    <Button onClick={addCard}>Add Card</Button>
                    <div className="grid gap-1">
                        <Text>Upload entire Deck</Text>
                        <input type="file" accept="application/json" onChange={handleUpload}/>
                    </div>
                    <div className="grid gap-1">
                        <Text>Add a single Card to Deck</Text>
                        <input type="file" accept="application/json" multiple onChange={addCardsToDeck}/>
                    </div>
                    <Button onClick={() => deck.toJSON()}>Export Entire Deck</Button>
                    <Button color="red" onClick={deleteDeck}>Delete Entire Deck</Button>

                </div>
            </CardRadix>
            <br/>
            <CardRadix className={"p-3 bg-border print:hide "}>
                To print cards, simply press Control+P and the export PDF option will be shown.
            </CardRadix>
            <br/>
            <br/>
        </div>

        {load ? <Flex align="center" gap="1"><Spinner size="3"/></Flex> :
            <div className={"grid grid-cols-4 print:grid-cols-3 gap-5 w-[1380px] print:gap-2 print:w-full"}
                 id={"decktainer"}>
                {deck.cards.sort(sortCards).map((card, i) => {
                    const CardTSX = card.tsx;
                    return (<div>
                        <CardTSX card={card}
                                 interact={true}
                                 onClick={() => {
                                     setCardIndex(i);
                                     setTab("cards")
                                 }}
                                 img={card.card.img}/>

                    </div>)
                })}
            </div>
        }
        <br/>

    </div>
}