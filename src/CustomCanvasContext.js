import loadImage from "./helpers/loadImage";
import smartquotes from "smartquotes";

export default function (context) {
	this.context = context;
	this.width = this.context.canvas.width;
	this.height = this.context.canvas.height;

	this.clear = function () {
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.width, this.height);
	};

	this.renderImage = function ({
		image,
		offsetLeft,
		offsetTop,
		scale,
		originalWidth,
		originalHeight,
	}) {
		this.context.drawImage(
			image,
			offsetLeft,
			offsetTop,
			originalWidth * scale,
			originalHeight * scale
		);
	};

	this.renderBrightnessFilter = function (brightnessPercentage) {
		this.context.fillStyle = `rgba(13, 13, 13, ${
			(100 - brightnessPercentage) / 100
		})`;
		this.context.fillRect(0, 0, this.width, this.height);
	};

	this.renderNoiseLayer = async function () {
		const image = await loadImage(
			require("./assets/noise-layer.svg").default
		);
		this.context.drawImage(image, 0, 0, this.width, this.height);
	};

	this.renderLogo = async function (src) {
		const image = await loadImage(src);
		this.context.drawImage(
			image,
			this.width * 0.025,
			this.width * 0.025,
			200,
			80
		);
	};

	this.renderQuote = function (text) {
		if (!text || text?.length === 0) return;

		// Correct quotation marks
		text = smartquotes(text);

		const words = text.split(" "),
			offsetLeft = this.width * 0.025,
			offsetTop = this.height * 0.15,
			maxWidth = this.width * 0.95,
			maxHeight = this.height * 0.7,
			lineHeight = 1.15;

		let fontSize = 1,
			lines = [];

		this.context.textBaseline = "top";
		this.context.letterSpacing = "2px";

		while ((lines.length + 1) * (fontSize + 1) * lineHeight < maxHeight) {
			this.context.font = `${fontSize++}px 'Fredericka the Great'`;

			lines = [""];
			let wordIndex = 0;

			do {
				const nextWord = words[wordIndex] + " ";

				if (
					this.context.measureText(lines[lines.length - 1] + nextWord)
						.width < maxWidth
				)
					lines[lines.length - 1] += nextWord;
				else lines.push(nextWord);
			} while (++wordIndex < words.length);
		}

		this.context.fillStyle = "white";

		const paddingTop =
			(maxHeight - lines.length * lineHeight * fontSize) / 2;

		lines.forEach((line, index) => {
			this.context.fillText(
				line,
				offsetLeft,
				offsetTop + index * fontSize * lineHeight + paddingTop
			);
		});
	};

	this.renderAuthor = function (text) {
		const fontSize = 36,
			color = "white", // "#CCB562",
			lineWidth = 2;

		this.context.fillStyle = color;
		this.context.textBaseline = "bottom";
		this.context.font = `600 ${fontSize}px 'Gill Sans'`;
		this.context.letterSpacing = "7px";

		const { width } = this.context.measureText(text);

		let offsetLeft = this.width * 0.975 - width,
			offsetBottom = this.height * 0.975;

		this.context.fillText(text, offsetLeft, offsetBottom);

		offsetBottom -= fontSize / 2 + lineWidth / 2;

		this.context.fillRect(
			this.width * 0.025,
			offsetBottom,
			offsetLeft - this.width * 0.05,
			lineWidth
		);
	};
}
