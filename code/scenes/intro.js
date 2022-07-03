// Define a scene called "opening" that goes to the scene called "space" when it's finished

import { generateSpice, textTransformAppearByLetter } from "../helpers"

function createIntro() {
  let intro

  scene("opening", () => {
    intro = play("intro", {
      volume: 0.8,
      loop: true
    })

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
      rotate(2),
      z(10)
    ])

    generateSpice(center())

    // TODO: Colorize "Enter" like for the "Press Y" in the ending screens.
    // (Also, should we make that one use "Enter" instead of "Y" for consistency?)
    const skipText = add([
      text("Press [Enter].highlight to Skip...",
        {
          size: 20,
          styles: {
            "highlight": { color: YELLOW.lighten(120) },
          }
        }),
      origin("center"),
      pos(width() * .25, height() * .1)
    ])
    onKeyPress("enter", () => {
      intro.stop()
      go("space")
    })

    // Play a little radio sound before crew message.
    // TODO: Add a nice bounding box for decoration around the
    // spoken text?
    play("radio", { speed: 1.5, volume: .3 })
    const conversation = add([
      text(`You know, it's been ten years since we've had anything other
          than powdered nutritional dust...`, {
        size: 20,
        transform: textTransformAppearByLetter(.02),
        styles: {
          "spice": { color: RED.lighten(90) }
        },
      }),
      origin("center"),
      pos(width() * .5, height() - 30)

    ])
    crew.onUpdate(() => {
      crew.pos.x -= dt() * 30
    })

    wait(7, () => {
      play("radio", { speed: 1.5, volume: .3 })
      conversation.text = "... I CAN'T LIVE LIKE THIS ANYMORE!!"
      // Reset text animation
      conversation.transform = textTransformAppearByLetter(.02)
    })
    wait(12, () => {
      play("radio", { speed: 1.5, volume: .3 })
      conversation.text = "... Do you know what I miss? [Spicy].spice things like..."
      conversation.transform = textTransformAppearByLetter(.02)
    })
    wait(16, () => {
      go("opening2")
    })
  })

  scene("opening2", () => {
    const food = add([
      sprite("tteokbokki"),
      scale(2),
      pos(center()),
      origin("center"),
      rotate(5),
      "food"
    ])

    const conversation = add([
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

    wait(5, () => {
      go("opening3")
    })
  })

  scene("opening3", () => {

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
      pos(width() * .5, height() - 200),
      origin("topright"),
      rotate(2),
      z(10)
    ])

    generateSpice(center())

    play("radio", { speed: 1.5, volume: .3 })
    const conversation = add([
      text(`... Look outside...`, {
        size: 20,
        transform: textTransformAppearByLetter(.02),
      }),
      origin("center"),
      pos(width() * .5, height() - 30),
    ])

    wait(4, () => {
      play("radio", { speed: 1.5, volume: .3 })
      conversation.text = "That broken down ship left behind food everywhere..."
      // Reset text animation
      conversation.transform = textTransformAppearByLetter(.02)
    })
    wait(8, () => {
      play("radio", { speed: 1.5, volume: .3 })
      conversation.text = "It has everything we need for Tteokbokki..."
      conversation.transform = textTransformAppearByLetter(.02)
    })
    wait(12, () => {
      play("radio", { speed: 1.5, volume: .3 })
      conversation.text = "STOP THE SHUTTLE!"
      conversation.transform = textTransformAppearByLetter(.02)
    })
    wait(15, () => go("title"))
    crew.onUpdate(() => {
      crew.pos.x -= dt() * 10
    })
    const skipText = add([
      text("Press [Enter].highlight to Skip...",
        {
          size: 20,
          styles: {
            "highlight": { color: YELLOW.lighten(120) },
          }
        }),
      origin("center"),
      pos(width() * .25, height() * .1)
    ])
    onKeyPress("enter", () => {
      intro.stop()
      go("space")
    })

  })


  scene("title", () => {

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
    const tip1 =
      add([
        sprite("gameplay"),
        origin("center"),
        pos(width() * .9, height() * .5)
      ])
    const tip2 =
      add([
        sprite("astro"),
        scale(3),
        origin("center"),
        pos(width() * .1, height() * .5)
      ])

    wait(6, () => {
      instructions.text = `Press Spacebar\n to use thrust\n to propel the astronaut\n
        Press the arrow keys to change\n the astronaut's direction\n`
    })
    wait(12, () => {
      instructions.text = `For Tteokbokki you need: 3 X Chili Flakes`
      const item1 = add([
        sprite("chiliFlakes"),
        origin("center"),
        pos(width() * .1, height() * .2)
      ])
    })
    wait(15, () => {
      instructions.text = `For Tteokbokki you need: 5 X Gochujang Tins`

      const item2 = add([
        sprite("gochujang"),
        origin("center"),
        pos(width() * .5, height() * .2)
      ])
    })
    wait(18, () => {
      instructions.text = `For Tteokbokki you need: 5 X Bags of Rice`

      const item3 = add([
        sprite("rice"),
        origin("center"),
        pos(width() * .9, height() * .2)
      ])
    })
    wait(24, () => {
      startInstructions.text = `Press [ENTER].highlight to START`

      const tip3 =
        add([
          sprite("meter"),
          origin("center"),
          pos(width() * .1, height() * .8)
        ])
      const tip3Text = add([
        text("O2 Meter", { size: 20 }),
        origin("center"),
        pos(width() * .1, height() * .95)
      ])
      const tip4 =
        add([
          sprite("shuttle"),
          origin("center"),
          scale(2),
          pos(width() * .9, height() * .8)
        ])
      const tip4Text = add([
        text("Shuttle", { size: 20 }),
        origin("center"),
        pos(width() * .9, height() * .9)
      ])
      instructions.text = `Just make sure you\n watch your O2 meter so you get back\n to the shuttle before running out of oxygen!!\n\n\n\n`
    })

    onKeyPress("enter", () => {
      intro.stop()
      go("space")
    })
  })

}

export { createIntro }