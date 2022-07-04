// Define a scene called "opening" that goes to the scene called "space" when it's finished

import { generateSpice, textTransformAppearByLetter } from "./helpers"

function createIntro() {
  let introMusic
  let crewTextObj
  let crewTextBoundingBox

  const goToGame = () => {
    introMusic.stop()
    go("space")
  }

  const showCrewText = (crewText) => {
    if (crewTextObj) {
      crewTextObj.destroy()
    }
    if (crewTextBoundingBox) {
      crewTextBoundingBox.destroy()
    }
    // Play a little radio sound before crew message.
    play("radio", { speed: 1.5, volume: .3 })
    crewTextObj = add([
      text(crewText, {
        size: 20,
        styles: {
          "spice": { color: RED.lighten(90) }
        },
      }),
      origin("center"),
      pos(width() * .5, height() - 30),
    ])
    crewTextObj.hidden = true

    // Add a nice bounding box for decoration around the
    // spoken text.
    const boundingBoxSize = vec2(
      crewTextObj.width + 10,
      crewTextObj.height + 10)
    crewTextBoundingBox = add([
      // Grows from 0 to boundingBoxSize
      rect(crewTextObj.width + 10, crewTextObj.height + 10),
      color(BLACK.lighten(64)),
      opacity(0.4),
      outline(1, BLACK.lighten(48)),
      pos(crewTextObj.pos),
      origin("center"),
      z(-1),
    ])
    const t0 = time()
    crewTextBoundingBox.onUpdate(() => {
      crewTextBoundingBox.width = mapc(time() - t0, 0, .1, 0, boundingBoxSize.x)
      crewTextBoundingBox.height = mapc(time() - t0, 0, .1, 0, boundingBoxSize.y)
    })
    wait(.1, () => {
      crewTextObj.hidden = false
      crewTextObj.transform = textTransformAppearByLetter(.02)
    })
  }

  scene("opening", async () => {
    introMusic = play("intro", {
      volume: 0.8,
      loop: true
    })
    addPressEnter(goToGame)

    const ship = add([
      sprite("cargoShip"),
      scale(2),
      pos(center().add(100, 50)),
      origin("center"),
      rotate(5),
    ])
    const crew = add([
      sprite("shuttle", { flipX: true }),
      scale(2),
      pos(width() + 100, height() - 200),
      origin("topright"),
      move(LEFT, 20),
      z(10)
    ])

    generateSpice(center())

    showCrewText(`You know, it's been ten years since we've had anything other
      than powdered nutritional dust...`)

    await wait(7)
    showCrewText("... I CAN'T LIVE LIKE THIS ANYMORE!!")
    await wait(5)
    showCrewText("... Do you know what I miss? [Spicy].spice things like...")
    await wait(4)
    go("opening2")
  })

  scene("opening2", async () => {
    onKeyPress("enter", goToGame)
    const food = add([
      sprite("tteokbokki"),
      scale(2),
      pos(center()),
      origin("center"),
      rotate(5),
      "food"
    ])

    add([
      text(`Tteokbokki`, {
        size: 100,
        // Transform each character for special effects
        transform: (idx, ch) => ({
          pos: vec2(0, wave(-3, 3, time() * 4 - idx * 1.5)),
        }),
      }),
      origin("center"),
      pos(center())
    ])
    await wait(2)

    const t0 = time()
    food.onUpdate(() => {
      food.opacity = mapc(time() - t0, 0, 3, 1.0, 0.0)
    })
    await wait(3)

    go("opening3")
  })

  scene("opening3", async () => {
    addPressEnter(goToGame)

    add([
      sprite("cargoShip"),
      scale(2),
      pos(center().add(100, 50)),
      origin("center"),
      rotate(5),
    ])
    const crew = add([
      sprite("shuttle", { flipX: true }),
      scale(2),
      pos(width() * .5, height() - 200),
      origin("topright"),
      z(10),
    ])
    let crewSpeed = 10
    crew.onUpdate(() => {
      crew.pos.x -= dt() * crewSpeed
    })

    generateSpice(center())

    showCrewText(`... Look outside...`)
    await wait(4)

    showCrewText("That broken down ship left behind food everywhere...")
    await wait(4)

    showCrewText("It has everything we need for Tteokbokki...")
    await wait(4)

    showCrewText("STOP THE SHUTTLE!")
    crewSpeed = 5
    await wait(3)

    go("title")
  })

  scene("title", async () => {
    onKeyPress("enter", goToGame)
    const startInstructions =
      add([
        text(`Press [ENTER].highlight to SKIP instructions...`,
          {
            size: width() > 600 ? 20 : 14,
            styles: {
              "highlight": { color: YELLOW.lighten(120) },
            }
          }),
        origin("center"),
        pos(width() * .5, height() * .8)
      ])

    const title =
      add([
        text("Spice of Life", { size: 30 }),
        pos(center().x, height() * .05),
        origin("top"),
      ])
    const instructions =
      add([
        text(`Help the homesick astronaut salvage\n the perfect ingredients from the wrecked cargo ship.`,
          { size: width() > 600 ? 20 : 14 }),
        pos(center().x, height() * .5),
        origin("center"),
      ])
    add([
      sprite("astro"),
      scale(3),
      origin("center"),
      pos(width() * .1, height() * .5)
    ])
    await wait(6)

    instructions.text = `For Tteokbokki you need:\n3 X Chili Flakes`
    const item1 = add([
      sprite("chiliFlakes"),
      origin("center"),
      pos(width() * .1, height() * .2)
    ])
    await wait(3)

    instructions.text = `For Tteokbokki you need:\n5 X Gochujang Tins`
    const item2 = add([
      sprite("gochujang"),
      origin("center"),
      pos(width() * .5, height() * .2)
    ])
    await wait(3)

    instructions.text = `For Tteokbokki you need:\n5 X Bags of Rice`

    const item3 = add([
      sprite("rice"),
      origin("center"),
      pos(width() * .9, height() * .2)
    ])
    await wait(6)

    startInstructions.text = `Press [ENTER].highlight to START`

    const o2Tip =
      add([
        sprite("meter"),
        origin("center"),
        pos(width() * .1, height() * .8)
      ])
    const o2TipText = add([
      text("O2 Meter", { size: 20 }),
      origin("center"),
      pos(width() * .1, height() * .95)
    ])
    const shuttleTip =
      add([
        sprite("shuttle"),
        origin("center"),
        scale(2),
        pos(width() * .9, height() * .8)
      ])
    const shuttleTipText = add([
      text("Shuttle", { size: 20 }),
      origin("center"),
      pos(width() * .9, height() * .9)
    ])
    instructions.text = `Just make sure you\nwatch your O2 meter so you get back\nto the shuttle before running out of oxygen!!`
  })

}

function addPressEnter(enterAction) {
  onKeyPress("enter", enterAction)
  return add([
    text("Press [Enter].highlight to Skip...",
      {
        size: width() > 600 ? 20 : 14,
        styles: {
          "highlight": { color: YELLOW.lighten(120) },
        }
      }),
    origin("center"),
    pos(width() * .25, height() * .1)
  ])
}

export { createIntro }
