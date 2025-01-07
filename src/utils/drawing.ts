/**
 * Drawing utility functions for the game
 */

/**
 * Draws a box with specified dimensions and alpha transparency
 */
export function drawBox(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha: number
): void {
  context.fillStyle = `rgba(0, 0, 0, ${alpha})`
  context.fillRect(x, y, width, height)
}

/**
 * Draws text within a box with specified dimensions
 */
export function drawTextInBox(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha: number
): void {
  context.fillStyle = `rgba(255, 255, 255, ${alpha})`
  context.fillText(text, x + 10, y + 20)
}
