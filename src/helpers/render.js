export function changeRenderState (childes, scroll) {
	for (let child of childes) {
		if (child.data && child.data.dontUpdateRenderState) {
			continue;
		}

		const bounds = child.getBounds();

		child.visible = (
			// elements that starts in the visible part
			(
				bounds.x >= -scroll.offset &&
				bounds.x <= scroll.width + scroll.offset &&
				bounds.y >= -scroll.offset &&
				bounds.y <= scroll.height + scroll.offset
			) ||

			// elements that ends in the visible part
			(
				bounds.x + bounds.width >= -scroll.offset &&
				bounds.x + bounds.width <= scroll.width + scroll.offset &&
				bounds.y + bounds.height >= -scroll.offset &&
				bounds.y + bounds.height <= scroll.height + scroll.offset
			)
		);
	}
}