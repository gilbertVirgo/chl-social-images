import CustomCanvasContext from "../../CustomCanvasContext";
import React from "react";
import handleMouseEvents from "./handleMouseEvents";

export default ({
	apparentWidth,
	actualWidth,
	backgroundImage,
	setBackgroundImage,
	inputFields,
	authorTextColor,
}) => {
	const canvasRef = React.useRef();

	React.useEffect(
		handleMouseEvents.bind(null, {
			backgroundImage,
			canvasRef,
			apparentWidth,
			actualWidth,
			setBackgroundImage,
		}),
		[backgroundImage.image, backgroundImage.scale]
	);

	React.useEffect(() => {
		if (canvasRef.current) {
			(async function () {
				const customContext = new CustomCanvasContext(
					canvasRef.current.getContext("2d")
				);

				customContext.clear();
				if (backgroundImage.image)
					customContext.renderImage(backgroundImage);

				customContext.renderBrightnessFilter(
					+inputFields["Image brightness"]
				);

				// await customContext.renderNoiseLayer();

				await customContext.renderLogo(inputFields["Logo type"]);

				customContext.renderQuote(inputFields["Quote"]);

				customContext.renderAuthor(
					inputFields["Author"],
					authorTextColor
				);
			})();
		}
	}, [backgroundImage, inputFields, authorTextColor]);

	return (
		<canvas
			ref={canvasRef}
			style={{ width: `${apparentWidth}px` }}
			width={actualWidth}
			height={actualWidth}
		/>
	);
};
