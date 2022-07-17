import * as PIXI from "pixi.js";

export function renderUserItem(holder, height) {
	// draw user icons
	const icon = PIXI.Sprite.from('user.svg');
	icon.width = 46;
	icon.height = 46;
	icon.antialias = true;
	icon.anchor.set(0.5);
	icon.x = 32;
	icon.y = height + 25;

	const firstName = new PIXI.Text(
		'Gary',
		{
			fontFamily : 'sans-serif',
			fontSize: 11,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	const lastName = new PIXI.Text(
		'ROMERO',
		{
			fontFamily : 'sans-serif',
			fontSize: 11,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	firstName.anchor.set(0.5);
	firstName.x = 32;
	firstName.y = height + 58;

	lastName.anchor.set(0.5);
	lastName.x = 32;
	lastName.y = height + 72;

	holder.content.addChild(icon);
	holder.content.addChild(firstName);
	holder.content.addChild(lastName);
}