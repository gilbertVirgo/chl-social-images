import { Form, Stack } from "react-bootstrap";
import { authorTextCompositeColorChannelMax, canvasWidth } from "./config";

import Canvas from "./components/Canvas";
import { FastAverageColor } from "fast-average-color";
import React from "react";
import imageFromDataURL from "./helpers/imageFromDataURL";
import inputFieldMap from "./inputFieldMap";

function App() {
	const wrapperWidth = 480,
		canvasInnerWidth = canvasWidth;

	const [backgroundImage, setBackgroundImage] = React.useState({
		image: undefined,
		aspectRatio: undefined,
		offsetLeft: 0,
		offsetTop: 0,
		scale: 1,
		blurAmount: inputFieldMap.find((field) => field.label === "Image blur")
			.initialValue,
	});

	const [inputFields, setInputFields] = React.useState(
		Object.fromEntries(
			inputFieldMap.map(({ label, initialValue = "" }) => [
				label,
				initialValue,
			])
		)
	);

	const [authorTextColor, setAuthorTextColor] =
		React.useState("rgb(0, 0, 0)");

	const formatField = ({ label, Element, props, onChange }, index) => (
		<Form.Group key={`input-field-${index}`}>
			<Form.Label>{label}</Form.Label>
			<Element
				value={inputFields[label]}
				onChange={onChange.bind(null, (newValue) =>
					setInputFields((inputFields) => {
						const inputFieldsCopy = {
							...inputFields,
						};
						inputFieldsCopy[label] = newValue;
						return inputFieldsCopy;
					})
				)}
				{...props}
			/>
		</Form.Group>
	);

	const handleFileUpload = ({
		target: {
			files: [file],
		},
	}) => {
		const fileReader = new FileReader();

		fileReader.onload = () =>
			imageFromDataURL(fileReader.result).then((image) => {
				const aspectRatio = image.naturalWidth / image.naturalHeight;
				let originalWidth, originalHeight;

				if (aspectRatio < 1) {
					originalWidth = canvasInnerWidth;
					originalHeight = originalWidth / aspectRatio;
				} else {
					originalHeight = canvasInnerWidth;
					originalWidth = originalHeight * aspectRatio;
				}

				new FastAverageColor().getColorAsync(image).then((color) => {
					let [r, g, b] = color.value;

					// Cumulative value of the channels should be at least 255;

					while (r + g + b < authorTextCompositeColorChannelMax) {
						r = Math.min(255, r + 1);
						g = Math.min(255, g + 1);
						b = Math.min(255, b + 1);
					}

					setAuthorTextColor(`rgb(${r}, ${g}, ${b})`);
				});

				setBackgroundImage({
					image,
					offsetLeft: 0,
					offsetTop: 0,
					scale: 1,
					originalWidth,
					originalHeight,
				});
			});

		fileReader.onerror = (error) => alert(`Error reading file: ${error}`);

		if (file) fileReader.readAsDataURL(file);
	};

	React.useEffect(() => {
		setBackgroundImage((backgroundImage) => {
			const backgroundImageCopy = { ...backgroundImage };
			backgroundImageCopy.scale = +inputFields["Image zoom"] / 100;
			backgroundImageCopy.blurAmount = +inputFields["Image blur"];
			return backgroundImageCopy;
		});
	}, [inputFields]);

	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "15px",
			}}
		>
			<Stack
				style={{
					width: `${wrapperWidth}px`,
					maxWidth: "calc(100% - 30px)",
					alignSelf: "center",
				}}
				gap={3}
			>
				<Form.Group>
					<Form.Label>Background image</Form.Label>
					<Form.Control type="file" onChange={handleFileUpload} />
				</Form.Group>
				{inputFieldMap.map(formatField)}

				<Canvas
					apparentWidth={wrapperWidth}
					actualWidth={canvasInnerWidth}
					backgroundImage={backgroundImage}
					setBackgroundImage={setBackgroundImage}
					inputFields={inputFields}
					authorTextColor={authorTextColor}
				/>
			</Stack>
		</main>
	);
}

export default App;
