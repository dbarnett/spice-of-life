import { parallax } from "./components"

// Return text CharTransformFunc for animating text to appear letter-by-letter.
function textTransformAppearByLetter(rate) {
  const t0 = time()
  return (idx, ch) => ({
    // Opaque only if a particular time has elapsed proportional to idx
    // Note: I do not understand why "0" is opaque and "1" is hidden. Possible bug?
    opacity: (time() - t0) >= idx * rate ? 0.0 : 1.0,
  })
}

// Return text CharTransformFunc to cycle gradually between two colors.
function textTransformCycleColors(c1, c2, rate) {
  const t0 = time()
  return (idx, ch) => {
    // Start at 100% c1 (subtract π/2 since
    // sin(-π/2) is its minimum)
    const waveVal = (time() - t0) * Math.PI * 2 * rate - Math.PI / 2
    return {
      color: rgb(
        wave(c1.r, c2.r, waveVal),
        wave(c1.g, c2.g, waveVal),
        wave(c1.b, c2.b, waveVal),
      ),
    }
  }
}

// TODO: Probably game object helpers that depend on other
// components like parallax should be in a separate file so
// we don't have a dependency cycle helpers->components->helpers.
function generateSpice(centerPoint) {

  const food = []

  for (let i = 0; i < 5; i++) {
    const spice1 = add([
      sprite("chiliFlakes"),
      area(),
      origin("center"),
      pos(centerPoint.add(
        Vec2.fromAngle(rand(360))
          .scale(rand(2, 10) ** 3))),
      scale(.8),
      "spice",
      "chiliFlake",
    ])
    food.push(spice1)
  }
  for (let i = 0; i < 5; i++) {
    const spice2 = add([
      sprite("gochujang"),
      area(),
      origin("center"),
      pos(centerPoint.add(
        Vec2.fromAngle(rand(360))
          .scale(rand(2, 10) ** 3))),
      scale(.8),
      "spice",
      "gochujang",
    ])
    food.push(spice2)
  }
  const spice5 = 
    add([
      sprite("gochujang"),
      area(),
      origin("center"),
      pos((width() - 100) + rand() * 90, height() * (rand() * .8)),
      "spice",
      "gochujang"
    ])
  food.push(spice5)

  for (let i = 0; i < 4; i++) {
    const spice3 = add([
      sprite("rice"),
      area(),
      origin("center"),
      pos(centerPoint.add(
        Vec2.fromAngle(rand(360))
          .scale(rand(2, 10) ** 3))),
      scale(.8),
      "spice",
      "rice",
    ])
    food.push(spice3)
  }
  for (let i = 0; i < 3; i++) {
    const spice4 = add([
      sprite("rice"),
      area(),
      origin("center"),
      pos((width() + 100) + rand() * 200, height() * (rand() * .8)),
      "spice",
      "rice"
    ])
  }
  return food
}

function generateStars() {
  const stars = []
  // Add near stars
  for (let i = 0; i < 100; i++) {
    const star = add([
      rect(3, 3),
      WHITE,
      // Cluster stars around center, sparser as you go farther out.
      pos(Vec2.fromAngle(rand(360)).scale(rand(3000) ** 1.3).add(center())),
      parallax(.5),
    ])
    stars.push(star)
  }
  // Add far stars
  for (let i = 0; i < 100; i++) {
    const star = add([
      rect(1, 1),
      WHITE,
      pos(Vec2.fromAngle(rand(360)).scale(rand(2000) ** 1.4).add(center())),
      parallax(.2),
    ])
    stars.push(star)
  }
  return stars
}

function setupAirJets(astronaut) {
  // Set up a little jet of air behind astronaut, visible whenever thrusting.
  const thrustJet = add([
    sprite("airjet", { anim: "blowing" }),
    pos(),
    follow(astronaut),
    // Make origin above jet near center of astronaut so it
    // rotates properly around astronaut.
    origin(vec2(0, -3)),
  ])
  thrustJet.onUpdate(() => {
    thrustJet.angle = astronaut.angle
    thrustJet.hidden = !isKeyDown("space")
  })

  // Set up sideways air jets for left/right steering.
  const leftJet = add([
    sprite("airjet", { anim: "blowing" }),
    scale(.6),
    pos(),
    follow(astronaut),
    origin("top"),
  ])
  leftJet.onUpdate(() => {
    // I like this effect but should the side jets be on opposite sides?
    leftJet.angle = astronaut.angle + 120
    // Adjust offset to always keep near left leg as astronaut rotates
    leftJet.follow.offset = Vec2.fromAngle(astronaut.angle + 90 + 50).scale(12)
    leftJet.hidden = !isKeyDown("left")
  })
  const rightJet = add([
    sprite("airjet", { anim: "blowing" }),
    scale(.6),
    pos(),
    follow(astronaut),
    origin("top"),
  ])
  rightJet.onUpdate(() => {
    rightJet.angle = astronaut.angle - 120
    // Adjust offset to always keep near right leg as astronaut rotates
    rightJet.follow.offset = Vec2.fromAngle(astronaut.angle + 90 - 50).scale(12)
    rightJet.hidden = !isKeyDown("right")
  })

}

/**
 * Pull camera to follow target, but with slight "drag" toward center
 * so that as target keeps wandering farther out from center
 * they asymptotically approach edge of screen.
 */
function pullCamTowards(target) {
  // Need a function that starts out near zero and
  // asymptotically approaches some max as x goes to infinity.
  // Arctan will do that (approaches π/2).
  const centerOffset = center().sub(target.pos)
  const horizPull = Math.atan(centerOffset.x / 300) / (Math.PI / 2)
  const vertPull = Math.atan(centerOffset.y / 300) / (Math.PI / 2)

  // Use these horiz/vert pulls to pull the camera some fraction
  // of the screen width/height from player towards the center.
  camPos(target.pos.add(vec2(
    horizPull * (width() / 2 - target.width),

    vertPull * (height() / 2 - target.height)
  )))
}

// Generates a pointer towards shuttle with tag "pointer".
function generatePointer() {
  // Blue ring with black circle inside
  const pointerCircle = add([
    circle(20),
    color(BLUE.darken(127)),
    origin("center"),
    pos(),
    fixed(),
    "pointer",
  ])
  add([
    circle(17),
    color(BLACK),
    pos(),
    fixed(),
    follow(pointerCircle),
    "pointer",
  ])
  // Small image of shuttle in the circle
  add([
    sprite("shuttle"),
    scale(.8),
    rotate(30),
    origin("center"),
    pos(),
    fixed(),
    follow(pointerCircle),
    "pointer",
  ])
  // Pointer around the edge of the circle, made from
  // a tilted square behind the edge of the circle
  add([
    rect(20, 20),
    color(BLUE.darken(127)),
    origin("botright"),
    pos(),
    fixed(),
    z(-1),
    follow(pointerCircle),
    "pointer",
    "pointerArrow",
  ])
}

export { textTransformAppearByLetter, textTransformCycleColors, generateSpice, generateStars, setupAirJets, pullCamTowards, generatePointer }