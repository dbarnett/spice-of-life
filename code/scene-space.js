import { parallax } from "./components"
import { generatePointer, generateSpice, generateStars, pullCamTowards, setupAirJets, textTransformCycleColors } from "./helpers"

function createSpaceScene(itemQtys) {
  let alarm = null;

  scene("space", () => {
    const music = play("music", {
      volume: 0.8,
      loop: true
    })
  
    // Stars with some parallax that tracks w/ astronaut's motion
    generateStars()
  
    add([
      sprite("spacestation"),
      scale(2),
      pos(center().add(width() * .7, height() * -1.4)),
      rotate(-10),
      origin("center"),
      parallax(.3),
    ])
  
    const cargoShip = add([
      sprite("cargoShip"),
      scale(2),
      pos(center().add(100, 50)),
      origin("center"),
      rotate(5),
      parallax(.2),
    ])
  
  
    add([
      sprite("ufo", {
        anim: "spinning",
        animSpeed: .5,
      }),
      scale(3),
      pos(center().add(width() * -.9, height() * 1.3)),
      origin("center"),
      parallax(.1),
    ])

    add([
      sprite("comet", {
        anim: "blazing",
        animSpeed: .8,
      }),
      scale(1.5),
      pos(center().add(-500, -300)),
      origin("center"),
      move(135, 5),
      parallax(.1),
    ])
    add([
      sprite("comet", {
        anim: "blazing",
        animSpeed: .8,
        flipX: true,
      }),
      scale(1.5),
      pos(center().add(300, 200)),
      origin("center"),
      move(45, 5),
      parallax(.1),
    ])

    // TODO: Add some other fun space objects
  
    const astronaut = add([
      sprite("astro", {
        height: 30,
        width: 25
      }),
      z(10),
      pos(center()),
      rotate(0),
      origin("center"),
      body({ weight: 0 }),
      // Note: Collision area gets adjusted as rotation goes more vert/horiz.
      area({ width: 25, height: 30 }),
      "player",
      // Start with gentle spin & drift
      { spin: 5, momentum: Vec2.fromAngle(150).scale(3) },
    ])
  
    setupAirJets(astronaut)
  
    astronaut.onUpdate(() => {
      pullCamTowards(astronaut)
      // Adjust area rectangle to align better with rotation
      // tan is in range [-1, 1] only for angles closer to 0 or π (see graph of tan).
      // In those ranges astronaut is pointing more vertical than horizontal,
      // so height should be larger than width.
      // Swap if height/width don't already agree with angle.
      const { width, height } = astronaut.area
      if ((Math.abs(Math.tan(deg2rad(astronaut.angle))) < 1) != (height > width)) {
        astronaut.area.width = height
        astronaut.area.height = width
      }
  
      // Steering
      // Direction is either 1 (right), 0 (neutral), or -1 (left)
      const steeringDirection =
        (isKeyDown("right") ? 1 : 0) -
        (isKeyDown("left") ? 1 : 0)
  
      // If turning against spin, instead of letting it fight
      // your turning, reset to 0 first.
      if (steeringDirection != 0 && Math.sign(astronaut.spin) != Math.sign(steeringDirection)) {
        astronaut.spin = 0
      }
      astronaut.spin = Math.max(Math.min(astronaut.spin + dt() * steeringDirection * 100, 500), -500)
      if (isKeyDown("space")) {
        // Rotate thrust by 90° since astronaut at 0° means "up"
        // but vector at 0° means "right".
        const thrust = Vec2.fromAngle(astronaut.angle - 90).scale(.5)
        astronaut.momentum = astronaut.momentum.add(thrust)
      }
  
      // Spin
      astronaut.angle += dt() * (steeringDirection * 50 + astronaut.spin)
      // Momentum
      astronaut.move(astronaut.momentum)
    })
  
    const shuttle = add([
      sprite("shuttle"),
      scale(2),
      pos(width() * .1, height() * .1),
      area(),
      origin("center"),
      rotate(30),
      parallax(.2),
      "shuttle",
    ])
  
    astronaut.onCollide("shuttle", () => {
  
      itemQtys[0] = item1Display.qty
      itemQtys[1] = item2Display.qty
      itemQtys[2] = item3Display.qty
  
      if (alarm) {
        alarm.stop()
      }
      music.stop()
      go("homesafe")
    })
  
    generatePointer()
    onUpdate(() => {
      const pointerParts = get("pointer")
  
      // Show pointer if shuttle is offscreen, hide otherwise.
      const xMargin = shuttle.width / 2
      const yMargin = shuttle.height / 2
      const screenPos = shuttle.screenPos()
      const pointerHidden =
        screenPos.x + xMargin > 0 &&
        screenPos.x - xMargin < width() &&
        screenPos.y + yMargin > 0 &&
        screenPos.y - yMargin < height()
  
      // Around each screen edge, test if the line
      // between player and shuttle intersects that edge.
      // If so, place pointer along that edge.
      // TODO: Apparently if you go far enough up this will show the pointer on the top instead of bottom.
      const corners = [
        vec2(.1, .1),
        vec2(.9, .1),
        vec2(.9, .9),
        vec2(.1, .9),
      ]
      let pointerPos = null;
      for (let i = 0; i < 4; i++) {
        const edgeLine = {
          p1: corners[i].scale(width(), height()),
          p2: corners[(i + 1) % 4].scale(width(), height())
        }
        const intersection = testLineLine({
          p1: toScreen(camPos()),
          p2: shuttle.screenPos(),
        }, edgeLine)
        if (intersection !== null) {
          pointerPos = intersection
          break
        }
      }
      pointerParts.forEach((part) => {
        part.hidden = pointerHidden
        if (pointerPos !== null) {
          part.moveTo(pointerPos)
        }
        if (part.is("pointerArrow")) {
          // Pointer is a tilted square, so -45° points due left
          part.angle = -45 + toWorld(part.pos).angle(shuttle.pos)
        }
      })
    })
  
    const food = generateSpice(cargoShip.pos)
  
    const item1Display =
      add([
        text("Chili Flakes (x3):", {
          size: 20,
          letterSpacing: -2,
        }),
        origin("botright"),
        pos(width() - 20, height() - 70),
        fixed(),
        { qty: 0, needed: 3 },
      ])
  
    add([
      sprite("chiliFlakes"),
      pos(item1Display.pos.x - 45, height() - 60),
      scale(.7),
      origin("botleft"),
      fixed()
    ])
    const item2Display =
      add([
        text("Chili Flakes (x3):", {
          size: 20,
          letterSpacing: -2,
        }),
        origin("botright"),
        pos(width() - 20, height() - 40),
        fixed(),
        { qty: 0, needed: 3 },
      ])
  
    add([
      sprite("gochujang"),
      pos(item1Display.pos.x - 45, height() - 30),
      scale(.7),
      origin("botleft"),
      fixed()
    ])
    const item3Display =
      add([
        text("", {
          size: 20,
          letterSpacing: -2,
        }),
        origin("botright"),
        pos(width() - 20, height() - 10),
        fixed(),
        { qty: 0, needed: 3 },
      ])
  
    add([
      sprite("rice"),
      pos(item1Display.pos.x - 45, height() - 5),
      scale(.7),
      origin("botleft"),
      fixed()
    ])
  
    astronaut.onCollide("chiliFlake", (spice) => {
      item1Display.qty += 1
  
      if (item1Display.qty == 3) item1Display.color = GREEN
      spice.destroy()
    })
    astronaut.onCollide("gochujang", (spice) => {
      item2Display.qty += 1
      if (item2Display.qty == 5) item2Display.color = GREEN
      spice.destroy()
    })
    astronaut.onCollide("rice", (spice) => {
      item3Display.qty += 1
      if (item3Display.qty == 5) item3Display.color = GREEN
      spice.destroy()
    })
    item1Display.onUpdate(() => {
      item1Display.text = "3 X    " + item1Display.qty
      item2Display.text = "5 X    " + item2Display.qty
      item3Display.text = "5 X    " + item3Display.qty
    })
  
    const meterDisplay = add([
      sprite("meter"),
      scale(.5),
      origin("botleft"),
      pos(0 + 10, height() - 10),
      fixed(),
    ])
  
  
    const oxDisplay = add([
      text("O2: " + 100, {
        size: 25,
      }),
      origin("botleft"),
      pos(0 + 50, height() - 10),
      fixed(),
      state("great", ["great", "okay", "low"]),
      {
        health: 100,
        textPrefix: "",
      },
    ])
  
    oxDisplay.onUpdate(() => {
      oxDisplay.health -= dt()
      if (oxDisplay.health <= 0) {
        astronaut.destroy()
  
        if (alarm) {
          alarm.stop()
        }
        music.stop()
        go("gameover")
      } else {
        oxDisplay.text = oxDisplay.textPrefix + "O2: " + oxDisplay.health.toFixed(0) + "%"

        // Frames go from 0 (full) to 3 (almost empty).
        meterDisplay.frame = 3 - Math.floor(oxDisplay.health / 25)
        const stateToUse =
          oxDisplay.health >= 75 ?
            "great" : (oxDisplay.health >= 25 ?
              "okay" : "low")
        if (oxDisplay.state != stateToUse) {
          oxDisplay.enterState(stateToUse)
        }
      }
    })
  
    oxDisplay.onStateEnter("okay", () => {
      music.detune(-50)
    })
    oxDisplay.onStateEnter("low", () => {
      alarm = play("alarm", {
        volume: 0.8,
        loop: true,
      })
      music.detune(-100)
      // Cycle colors a little slower than once per second
      oxDisplay.transform = textTransformCycleColors(WHITE, RED.lighten(127), .8)
    })
    oxDisplay.onStateUpdate("low", () => {
      // TODO: Also show an explicit "Return to shuttle!" message (over pointer?)
      oxDisplay.textPrefix = "WARNING!\n"
    })
    oxDisplay.onStateLeave("low", () => {
      alarm.stop()
      oxDisplay.textPrefix = ""
    })
  })
}

export { createSpaceScene }