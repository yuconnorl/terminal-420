export function getAngle(cx: number, cy: number, ex: number, ey: number) {
  const dy = ey - cy
  const dx = ex - cx
  const rad = Math.atan2(dy, dx)
  const deg = (rad * 180) / Math.PI
  return deg
}