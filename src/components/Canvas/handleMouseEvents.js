export default ({
	backgroundImage,
	canvasRef,
	apparentWidth,
	actualWidth,
	setBackgroundImage,
}) => {
	let isMouseDown = false,
		initialOffset = {
			backgroundImage: {
				left: backgroundImage.offsetLeft,
				top: backgroundImage.offsetTop,
			},
			page: {
				left: undefined,
				top: undefined,
			},
		},
		cachedBackgroundImage;

	const scale = apparentWidth / actualWidth;

	const handleMouseDown = ({ pageX, pageY }) => {
		isMouseDown = true;
		initialOffset.page.left = pageX;
		initialOffset.page.top = pageY;
	};
	const handleMouseUp = () => {
		isMouseDown = false;

		if (!cachedBackgroundImage) return;

		initialOffset.backgroundImage.left = cachedBackgroundImage.offsetLeft;
		initialOffset.backgroundImage.top = cachedBackgroundImage.offsetTop;
	};

	const handleMouseMove = ({ pageX, pageY }) => {
		if (!isMouseDown) return;

		const nextPosition = {
			offsetLeft:
				initialOffset.backgroundImage.left -
				(initialOffset.page.left - pageX) / scale,
			offsetTop:
				initialOffset.backgroundImage.top -
				(initialOffset.page.top - pageY) / scale,
		};

		// Check boundaries
		if (nextPosition.offsetLeft > 0) nextPosition.offsetLeft = 0;
		if (nextPosition.offsetTop > 0) nextPosition.offsetTop = 0;
		if (
			nextPosition.offsetLeft +
				backgroundImage.originalWidth * backgroundImage.scale <
			actualWidth
		)
			nextPosition.offsetLeft =
				actualWidth -
				backgroundImage.originalWidth * backgroundImage.scale;
		if (
			nextPosition.offsetTop +
				backgroundImage.originalHeight * backgroundImage.scale <
			actualWidth
		)
			nextPosition.offsetTop =
				actualWidth -
				backgroundImage.originalHeight * backgroundImage.scale;

		setBackgroundImage((backgroundImage) => {
			const backgroundImageCopy = { ...backgroundImage };

			backgroundImageCopy.offsetLeft = nextPosition.offsetLeft;
			backgroundImageCopy.offsetTop = nextPosition.offsetTop;

			cachedBackgroundImage = backgroundImageCopy;

			return backgroundImageCopy;
		});
	};

	canvasRef.current.addEventListener("mousedown", handleMouseDown);
	window.addEventListener("mouseup", handleMouseUp);
	window.addEventListener("mousemove", handleMouseMove);

	return () => {
		if (canvasRef.current)
			canvasRef.current.removeEventListener("mousedown", handleMouseDown);
		window.removeEventListener("mouseup", handleMouseUp);
		window.removeEventListener("mousemove", handleMouseMove);
	};
};
