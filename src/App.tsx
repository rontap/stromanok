import React, {useEffect, useState} from 'react'
import './App.css'
import './index.css'
import "@radix-ui/themes/styles.css";
import {Button, Checkbox, Heading, IconButton, Tabs, Text, TextArea, TextField, Theme} from '@radix-ui/themes';
import SliderInput from "./SliderInput.tsx";
import {Card, CardCtr} from "./Card.tsx";
import {convertBlobToBase64} from "./utils.ts";
import Deck from "./Deck.tsx";
import {Collection} from "./Collection.tsx";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import LandingPage from './LandingPage.tsx';

const transparentImage = new Image();
transparentImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6HpHqQAAAAASUVORK5CYII=";


function App() {
    const [count, setCount] = useState(0);
    const [deck, setDeck] = useState(new Collection([]));
    const [dragStart, setDragStart] = useState<[null | number, null | number]>([null, null]);
    const [dragStartPos, setDragStartPos] = useState<[null | number, null | number]>([null, null]);
    const [img, setImg] = useState(null);
    const [cardIndex, setCardIndex] = useState<number>(0);
    const [tab, setTab] = useState("deck");
    const [card, setCardH] = useState(deck.cards[cardIndex] || new Card());


    const setCard = (newCard: Card) => {
        console.log('>card', deck.cards[1]);
        setDeck(deck => {
            deck.cards[cardIndex] = newCard;
            return deck;
        })
        setCardH(newCard);
    }
    useEffect(() => {
        setCardH(deck.cards[cardIndex] || new Card());
    }, [cardIndex, deck]);
    const setCardInner = (card: CardCtr) => {
        const newCard = new Card(card);
        setCard(newCard);
    }
    const startDrag = (evt) => {
        setDragStartPos([card.xpos, card.ypos])

        setDragStart([evt.clientX, evt.clientY]);
        evt.dataTransfer.setDragImage(transparentImage, 0, 0);

    }
    const drag = (evt) => {
        setTimeout(() => {
            evt.dataTransfer.setDragImage(transparentImage, 0, 0);

        }, 100, evt);
        setPartialRaw("xpos")(dragStartPos[0] + dragStart[0] - evt.clientX);
        setPartialRaw("ypos")(dragStartPos[1] + dragStart[1] - evt.clientY);
    }
    const endDrag = (evt) => {
        drag(evt);
        setDragStartPos([null, null])
        setDragStart([null, null]);
    }

    const setPartial = (prop) => (evt) => {
        console.log(prop, evt)
        setCardInner({
            ...card.card,
            [prop]: evt.target.value
        })
    }
    const setPartialRaw = (prop) => (value) => {
        setCardInner({
            ...card.card,
            [prop]: value
        })
    }
    const handleFileUpload = (event) => {
        const ourl = URL.createObjectURL(event.target.files[0]);

        fetch(ourl)
            .then(res => res.json())
            .then(json => {
                const {img} = json;
                setCardInner(json);
                setImg(img);
            })
    }
    const handleImageUpload = (event) => {
        const ourl = URL.createObjectURL(event.target.files[0]);
        setImg(ourl);
        fetch(ourl)
            .then(res => res.blob())
            .then(convertBlobToBase64)
            .then(b64 => {
                console.log('blob', b64)
                setPartialRaw("img")(b64)
                URL.revokeObjectURL(ourl);
            })

    }
    const CardTSX = card.tsx;
    window.card = card;
    window.setCard = setCard;

    function deleteCard(card: Card) {
        deck.cards = deck.cards.filter(iter => {
            console.log(">>>", iter.card, card.card);
            return iter.card.name != card.card.name || iter.card.rank != card.card.rank
        })
        setDeck(deck);
        console.log(deck, '<newdeck');
        setTab("deck");
    }

    return (
        <><Theme id="theme"><Tabs.Root value={tab}>

            <div id={"head"} className={"print:hidden"}>

                <Tabs.List>
                    <b className={"mt-2.5"}>Strómanók Kártyagyár</b>

                    <Tabs.Trigger onClick={() => setTab("home")} value="home">Kezdőlap</Tabs.Trigger>
                    <Tabs.Trigger onClick={() => setTab("deck")} value="deck">Pakli</Tabs.Trigger>
                    <Tabs.Trigger onClick={() => setTab("cards")} value="cards">Kártyák</Tabs.Trigger>
                    <Tabs.Trigger onClick={() => setTab("eximport")} value="eximport">Export / Import</Tabs.Trigger>
                </Tabs.List>
            </div>
            <Tabs.Content className="TabsContent" value="home">
                <LandingPage/>
            </Tabs.Content>

            <Tabs.Content className="TabsContent" value="deck">
                <Deck deck={deck} setCardIndex={setCardIndex} setTab={setTab} setDeck={setDeck}/>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="cards">
                <div className={"mt-20 block absolute top-0 left-0 right-0"}>
                    <Heading>
                        <IconButton onClick={() => setTab("deck")}>
                            <ArrowLeftIcon/>
                        </IconButton>
                        {" "}
                        Editing Card
                        <i>{card.name}</i>
                    </Heading>
                    <br/>
                    <div className="grid grid-cols-2 gap-4 absolute left-0 right-0 top-15 grid-rows-1">
                        <div className="grid gap-4 grid-cols-1">
                            <span>
                               {/*TODO: Implement Dynamic zoom*/}
                                {/*<div className="align-center">*/}
                                {/*    <Radio value={"1"} />1×*/}
                                {/*    <Radio value={"1"}/>1.5×*/}
                                {/*    <Radio value={"1"}/>2×*/}
                                {/* </div>*/}
                                <div className="zoom-2">
                                    <CardTSX card={card}
                                             interact={false}
                                             img={img} setPartialRaw={setPartialRaw}
                                             drag={drag} startDrag={startDrag} endDrag={endDrag}/>
                                </div>
                            </span>

                        </div>
                        <div className="grid gap-2 grid-cols-1">
                            <Heading>Personal Details</Heading>
                            <TextField.Root
                                value={card.name}
                                onChange={setPartial("name")}
                                variant="surface" placeholder="Name of Person"/>
                            <TextField.Root variant="surface"
                                            value={card.chips}
                                            onChange={setPartial("chips")}
                                            placeholder="Chips (comma seperated)"/>
                            <Heading>Text Flavour (choose two)</Heading>
                            <TextArea
                                value={card.motto}
                                onChange={setPartial("motto")}
                                disabled={!!(card.effect && card.quote)}
                                placeholder="Motto of person"/>
                            <TextArea
                                value={card.effect}
                                onChange={setPartial("effect")}
                                disabled={!!(card.motto && card.quote)}

                                placeholder="Effect"/>
                            <TextArea
                                value={card.quote}
                                onChange={setPartial("quote")}
                                disabled={!!(card.effect && card.motto)}
                                placeholder="Quote from the person"/>
                            <div className="grid gap-1">
                                Rankless
                                <Checkbox
                                    checked={card.rankless}
                                    onCheckedChange={setPartialRaw("rankless")}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Rank of Card</Text>
                                <SliderInput
                                    initialValue={card.rank}
                                    onChange={setPartialRaw("rank")}
                                    min={0} max={36} placeholder={"Value"}/>
                            </div>

                            <Heading>Image</Heading>
                            <div className="grid gap-1">
                                <Text>Upload Image</Text>
                                <input type="file" accept="image/*" onChange={handleImageUpload}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Vertical Position</Text>
                                <SliderInput
                                    initialValue={card.ypos}
                                    onChange={setPartialRaw("ypos")}
                                    min={-1000} max={1000} placeholder={"Value"}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Horizontal Position</Text>
                                <SliderInput
                                    initialValue={card.xpos}
                                    onChange={setPartialRaw("xpos")}
                                    min={-1000} max={1000} placeholder={"Value"}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Zoom</Text>
                                <SliderInput
                                    initialValue={card.width}
                                    onChange={setPartialRaw("width")}
                                    min={-100} max={200}
                                    placeholder={"Value"}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Rotate</Text>
                                <SliderInput
                                    initialValue={card.deg}
                                    onChange={setPartialRaw("deg")}
                                    min={-180} max={180}
                                    placeholder={"Value"}/>
                            </div>
                            <div className="grid gap-1">
                                <Text>Mirror Image</Text>
                                <label>
                                    <Checkbox aria-label={"Vertical"} value={"vertical"}/> <span>Vertical</span>
                                </label>
                                <label>
                                    <Checkbox aria-label={"Vertical"} value={"vertical"}/> <span>Horizontal</span>
                                </label>
                            </div>
                            <Heading>Advanced</Heading>
                            <TextArea
                                value={card.css}
                                onChange={setPartial("css")}
                                placeholder="@{CSS}"/>
                            {/*<small>*/}
                            {/*    @cardRank - card rank container<br/>*/}
                            {/*    @cardMCE - <br/>*/}
                            {/*    @aCard -<br/>*/}
                            {/*    @aCardDyn -<br/>*/}
                            {/*    @cardChips -<br/>*/}
                            {/*    @st[2-7]*/}
                            {/*</small>*/}

                            <small>Edits are saved automatically</small>
                            <Button onClick={() => Card.download(card)}>Export</Button>
                            <Button color={"red"} onClick={() => deleteCard(card)}>Delete</Button>

                        </div>
                    </div>
                </div>
            </Tabs.Content>
        </Tabs.Root>
        </Theme>
        </>
    )
}

export default App
