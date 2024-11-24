import React, {useState} from 'react'
import './App.css'
import './index.css'
import "@radix-ui/themes/styles.css";
import {Button, Heading, Tabs, Text, TextArea, TextField, Theme} from '@radix-ui/themes';
import SliderInput from "./SliderInput.tsx";
import {Card, CardCtr} from "./Card.tsx";
import Svg from "./Svg.tsx";
import {convertBlobToBase64, getMimeType} from "./utils.ts";

const transparentImage = new Image();
transparentImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6HpHqQAAAAASUVORK5CYII=";


function App() {
    const [count, setCount] = useState(0);
    const [dragStart, setDragStart] = useState<[null | number, null | number]>([null, null]);
    const [dragStartPos, setDragStartPos] = useState<[null | number, null | number]>([null, null]);
    const [img, setImg] = useState(null);
    const [card, setCard] = useState<CardCtr>({
        name: "",
        rank: 16,
        xpos: 0,
        ypos: 0,
        width: 0,
        data: "0",
        chips: "",
        deg: 0,
        css: ""

    });
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
        setCard(card => ({
            ...card,
            [prop]: evt.target.value
        }))
    }
    const setPartialRaw = (prop) => (value) => {
        setCard(card => ({
            ...card,
            [prop]: value
        }))
    }
    const handleFileUpload = (event) => {
        const ourl = URL.createObjectURL(event.target.files[0]);

        fetch(ourl)
            .then(res => res.json())
            .then(json => {
                const {img} = json;
                setCard(json);
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
    window.card = card;
    window.setCard = setCard;
    return (
        <><Theme id="theme"><Tabs.Root defaultValue="account">

            <div id={"head"}>

                <Tabs.List>
                    <b className={"mt-2.5"}>Strómanók Kártyagyár</b>
                    <Tabs.Trigger value="account">Pakli</Tabs.Trigger>
                    <Tabs.Trigger value="documents">Kártyák</Tabs.Trigger>
                    <Tabs.Trigger value="settings">Export / Import</Tabs.Trigger>
                </Tabs.List>
            </div>

            <div className="grid grid-cols-2 gap-4  grid-rows-2 [marginTop:50px]">

                <div className="grid gap-4 grid-cols-1">
                    <div className="mt-0 cardOuter">

                        <div className={"aCard"}>
                            <div className="svgCtr">
                                <Svg card={card} setPartialRaw={setPartialRaw}/>
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
                                         src={img}/>
                                </div>

                                <div className={"cardName"}>{card.name}</div>
                                <div className={"cardMCE"}>
                                    <div>{card.effect}</div>
                                    <div>{card.motto}</div>
                                    {card.quote && <i>"{card.quote}"</i>}
                                </div>

                                <div className={"cardChips"}>{card.chips.split(",").map(chip => <span
                                    className={"chip"}>{chip}</span>)}</div>

                                <div>

                                </div>
                                <div className={"cardRank"}>{card.rank}</div>
                            </div>
                        </div>
                    </div>

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
                        <Text>Rank of Card.</Text>
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
                    <Button onClick={() => Card.download(card)}>Export</Button>
                    <Button disabled>Add Card</Button>
                    <hr/>
                    Load File
                    <TextField.Root
                        type="file" accept="application/json" onChange={handleFileUpload}/>

                </div>
            </div>
        </Tabs.Root>
        </Theme>
        </>
    )
}

export default App
