import * as PIXI from "pixi.js";

export function drawBackground(width, height) {
	const graphics = new PIXI.Graphics();

	// Header
	graphics.beginFill(0xf5f5f5);
	graphics.drawRect(0, 50, width, 2);
	graphics.endFill();

	// sidebar
	graphics.beginFill(0xf5f5f5);
	graphics.drawRect(62, 0, 2, height);
	graphics.endFill();

	return graphics;
}
