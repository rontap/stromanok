import React, {useState} from 'react'
import './App.css'
import './index.css'
import "@radix-ui/themes/styles.css";
import {Button, Heading, Slider, TextArea, Text, TextField, Theme} from '@radix-ui/themes';
import SliderInput from "./SliderInput.tsx";
import {CardCtr} from "./Card.tsx";

function App() {
    const [count, setCount] = useState(0)
    const [card, setCard] = useState<CardCtr>({
        name: "",
        rank: 16,
        xpos: 0,
        ypos: 0,
        width: 0,
        data: "0"

    })

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
    console.log(card)
    return (
        <><Theme id="theme" className="grid grid-cols-3">
            <div className="grid gap-4 grid-cols-1">
                Hi
            </div>
            <div className="grid gap-4 grid-cols-1">
                Hi
            </div>
            <div className="grid gap-2 grid-cols-1">
                <Heading>Personal Details</Heading>
                <TextField.Root
                    value={card.name}
                    onChange={setPartial("name")}
                    variant="surface" placeholder="Name of Person"/>
                <TextField.Root variant="surface" placeholder="Chips (comma seperated)"/>
                <Heading>Text Flavour (choose two)</Heading>
                <TextArea
                    value={card.motto}
                    onChange={setPartial("motto")}
                    placeholder="Motto of person"/>
                <TextArea
                    value={card.effect}
                    onChange={setPartial("effect")}
                    placeholder="Effect"/>
                <TextArea
                    value={card.quote}
                    onChange={setPartial("quote")}
                    placeholder="Quote from the person"/>
                <div className="grid gap-1">
                    <Text>Rank of Card.</Text>
                    <SliderInput initialValue={16} onChange={() => false} min={0} max={36} placeholder={"Value"}/>
                </div>

                <Heading>Image</Heading>

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
                        onChange={setPartialRaw("xypos")}
                        min={-1000} max={1000} placeholder={"Value"}/>
                </div>
                <div className="grid gap-1">
                    <Text>Zoom</Text>
                    <SliderInput
                        initialValue={card.width}
                        onChange={setPartialRaw("width")}
                        min={-1000} max={1000}
                        placeholder={"Value"}/>
                </div>

                <Button>Add Card</Button>

            </div>
        </Theme>
        </>
    )
}

export default App
