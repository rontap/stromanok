import {Card} from "./Card.tsx";

export const W = 874 / 3;
export const H = 1240 / 3;
export const rotateToMouse = (card: Card) => (e) => {
    const $card = document.querySelector('.card-id-' + card.rank);
    const bounds = $card.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
        // x: e.nativeEvent.offsetX - W / 2,
        // y: e.nativeEvent.offsetY - H / 2
        x: leftX - W / 2,
        y: topY - H / 2
    } 
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
    $card.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;
    if (document.querySelector(`.card-id-${card.rank} .glow`)) {
        document.querySelector(`.card-id-${card.rank} .glow`).style.backgroundImage = `
    radial-gradient(
      circle at
      ${center.x * 2 + bounds.width / 2}px
      ${center.y * 2 + bounds.height / 2}px,
      #ffffff55,
      #0000000f
    )
  `;
    }

}
export const endRotateToMouse = (card: Card) => (e) => {
    const $card = document.querySelector('.card-id-' + card.rank);
    $card.style.transform = '';
    if (document.querySelector(`.card-id-${card.rank} .glow`)) {
        document.querySelector(`.card-id-${card.rank} .glow`).style.background = '';
    }
}