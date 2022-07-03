// Note: Depends on kaboom globals like camPos being defined.

// Create a Parallax component that moves the current object
// inversely the camera.
// Note: Avoid updating pos directly, after creation, since those
// updates will bypass the parallax effect.
function parallax(scale) {
  let prevCamPos = camPos().clone()
  return {
    // Basic component config
    id: "parallax",
    require: ["pos"],
    // Custom properties
    parallaxScale: scale,
    // Component lifecycle methods
    update() {
      // Figure out camera's movement since last update and shift
      // current object accordingly.
      const curCamPos = camPos()
      const displacement = curCamPos.sub(prevCamPos)
      const parallaxDelta = displacement.scale(-this.parallaxScale)
      this.moveTo(this.pos.add(parallaxDelta))
      prevCamPos = curCamPos
    },
  }
}

export { parallax }