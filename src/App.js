import { Form, Stack } from "react-bootstrap";

import Canvas from "./components/Canvas";
import React from "react";
import imageFromDataURL from "./helpers/imageFromDataURL";
import inputFieldMap from "./inputFieldMap";

function App() {
	const wrapperWidth = 480,
		canvasInnerWidth = 1024;

	const [backgroundImage, setBackgroundImage] = React.useState({
		image: undefined,
		aspectRatio: undefined,
		offsetLeft: 0,
		offsetTop: 0,
		scale: 1,
	});

	const [inputFields, setInputFields] = React.useState(
		Object.fromEntries(
			inputFieldMap.map(({ label, initialValue = "" }) => [
				label,
				initialValue,
			])
		)
	);

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
				style={{ maxWidth: `${wrapperWidth}px`, alignSelf: "center" }}
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
				/>
			</Stack>
		</main>
	);
}

export default App;
