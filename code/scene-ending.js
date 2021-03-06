import { mapcColor } from './helpers'

function createEndings(itemQtys) {
  scene("homesafe", () => {
    let messageText;
    let bigSprite;
    if (itemQtys[0] >= 3 && itemQtys[1] >= 5 && itemQtys[2] >= 5) {
      messageText = "Tteokbokki for everyone!"
      bgSprite = sprite("tteokbokki")
    } else {
      messageText = "... but what's the crew supposed to eat now?"
      bgSprite = sprite("plate")
    }
    const happyMusic = play("happyMusic", {
      volume: 0.8,
    })
    // Background image
    add([
      bgSprite,
      origin("center"),
      pos(center()),
      scale(2),
    ])
    // Title
    add([
      text("You're Safe!", { size: 30 }),
      pos(center()),
      origin("center"),
    ])
    const message = add([
      text(messageText, {size: 20}),
      pos(center().x, center().y + 50),
      origin("center"),
      z(10)
    ]);
    addFooterAndControls(message.pos.add(0, 50), () => {
      happyMusic.stop()
    })
  })
  
  scene("gameover", () => {
    const sadMusic = play("sadMusic", {
      volume: 0.8,
    })

    // Astronaut sprite lifelessly floating out in space.
    const astronaut = add([
      sprite("astro"),
      scale(7),
      color(),
      pos(width() * .7, height() * .3),
      origin("center"),
      rotate(-15),
    ])
    const t0 = time()
    const c1 = astronaut.color.clone()
    astronaut.onUpdate(() => {
      astronaut.color = mapcColor(time() - t0, 0, 10, c1, BLACK)
      astronaut.angle += dt() * 3
      astronaut.move(3, -3)
    })

    const gameOverTitle = add([
      text("Space is a Cold Place...", { size: 30 }),
      pos(center()),
      origin("center"),
    ])
    addFooterAndControls(gameOverTitle.pos.add(0, 50), () => {
      sadMusic.stop()
    })
  })
}

function addFooterAndControls(footerPos, onLeaveScene) {
  add([
    text(
      "Press [Enter].highlight if you want to try again",
      {
        size: 22,
        styles: {
          "highlight": { color: YELLOW.lighten(120) },
        }
      },
    ),
    pos(footerPos),
    origin("center"),
  ])
  add([
    text("Programming: David & Hope        Graphics: Sophia", { size: 15 }),
    pos(width(), height() - 10),
    origin("botleft"),
    move(LEFT, 30),
  ])
  onKeyPress(["enter"], () => {
    onLeaveScene()
    go("space")
  })
}

export { createEndings }