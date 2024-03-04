import { Form } from "react-bootstrap";

const handleChangeInputField = (setNewValue, { target: { value } }) =>
	setNewValue(value);

export default [
	{
		label: "Quote",
		Element: Form.Control,
		props: { as: "textarea" },
		onChange: handleChangeInputField,
	},
	{
		label: "Author",
		Element: Form.Control,
		props: { type: "text" },
		onChange: (setNewValue, { target: { value } }) =>
			setNewValue(value.toUpperCase()),
	},
	{
		label: "Logo type",
		Element: Form.Select,
		initialValue: require("./assets/logo-red-black.svg").default,
		props: {
			children: [
				{
					value: require("./assets/logo-black.svg").default,
					text: "black",
				},
				{
					value: require("./assets/logo-red-black.svg").default,
					text: "red & black",
				},
				{
					value: require("./assets/logo-red-white.svg").default,
					text: "red & white",
				},
				{
					value: require("./assets/logo-white.svg").default,
					text: "white",
				},
			].map(({ value, text }, index) => (
				<option key={`select-option-${index}`} value={value}>
					{text}
				</option>
			)),
		},
		onChange: (setNewValue, { target }) =>
			setNewValue(target.options[target.selectedIndex].value),
	},
	{
		label: "Image brightness",
		Element: Form.Range,
		initialValue: 80,
		props: {
			min: 0,
			max: 100,
		},
		onChange: handleChangeInputField,
	},
	{
		label: "Image blur",
		Element: Form.Range,
		initialValue: 10,
		props: {
			min: 0,
			max: 30,
		},
		onChange: handleChangeInputField,
	},
	{
		label: "Image zoom",
		Element: Form.Range,
		initialValue: 100,
		props: {
			min: 100,
			max: 400,
		},
		onChange: handleChangeInputField,
	},
];
