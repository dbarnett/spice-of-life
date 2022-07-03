import kaboom from "kaboom"
import { createIntro } from "./scene-intro"
import { createSpaceScene } from "./scene-space"
import { createEndings } from "./scene-ending"

// initialize context
kaboom({
  background: [0, 0, 0],
})

loadSound("music", "./sounds/music.mp3")
loadSound("alarm", "./sounds/alarm.wav")
loadSound("sadMusic", "./sounds/sadMusic.mp3")
loadSound("happyMusic", "./sounds/happyMusic.mp3")
loadSound("intro", "./sounds/intro.mp3")
loadSound("radio", "./sounds/radio.wav")

loadPedit("meter", "sprites/meter.pedit")
loadPedit("gameplay", "sprites/gameplay.pedit")
loadPedit("plate", "sprites/plate.pedit")
loadPedit("tteokbokki", "sprites/tteokbokki.pedit")
loadSprite("shuttle", "sprites/shuttle.png");
loadPedit("cargoShip", "sprites/cargoShip.pedit")
loadPedit("rice", "sprites/rice.pedit")
loadPedit("chiliFlakes", "sprites/chiliFlakes.pedit")
loadPedit("gochujang", "sprites/gochujang.pedit")
loadSprite("astro", "sprites/astro.gif")
loadPedit("airjet", "sprites/airjet.pedit")
loadSprite("spacestation", "sprites/spacestation.png")
loadPedit("comet", "sprites/comet.pedit")
loadPedit("ufo", "sprites/ufo.pedit")
loadPedit("keys-arrows", "sprites/keys-arrows.pedit")
loadPedit("keys-spacebar", "sprites/keys-spacebar.pedit")

randSeed(Date.now())
const itemQtys = [0, 0, 0]

createIntro()
createSpaceScene(itemQtys)
createEndings(itemQtys)

go("opening")
