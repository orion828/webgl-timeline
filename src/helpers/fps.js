import * as PIXI from "pixi.js";

export function drawFps(app) {
	const fpsBg = new PIXI.Graphics();

	fpsBg.beginFill(0x000000, 0.5);
	fpsBg.drawRect(document.body.offsetWidth - 80, document.body.offsetHeight - 60, 80, 60);
	fpsBg.endFill();

	const fps = new PIXI.Text(
		Math.round(app.ticker.FPS),
		{
			fontFamily : 'sans-serif',
			fontSize: 30,
			fontWeight: 500,
			align : 'center',
			fill: 0xffffff
		}
	);

	fps.anchor.set(0.5);
	fps.x = document.body.offsetWidth - 40;
	fps.y = document.body.offsetHeight - 30;

	app.stage.addChild(fpsBg);
	app.stage.addChild(fps);

	return fps;
}