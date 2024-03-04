import {
	authorOffsetTop,
	logoHeight,
	logoOffsetLeft,
	logoOffsetTop,
	logoWidth,
	quoteMaxHeight,
	quoteMaxWidth,
	quoteOffsetTop,
	textOffsetLeft,
} from "./config";

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
		blurAmount,
	}) {
		this.context.save();
		this.context.filter = `blur(${blurAmount}px)`;
		this.context.drawImage(
			image,
			offsetLeft,
			offsetTop,
			originalWidth * scale,
			originalHeight * scale
		);
		this.context.restore();
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
			logoOffsetLeft,
			logoOffsetTop,
			logoWidth,
			logoHeight
		);
	};

	this.renderQuote = function (text) {
		if (!text || text?.length === 0) return;

		// Correct quotation marks
		text = smartquotes(text);

		const lineHeight = 1.15;

		let words = text.trim().split(" ");

		if (words.length > 1) {
			// To prevent orphans, join the last two words
			// together with a fake 'non-breaking space'
			const lastWord = words.pop();

			words[words.length - 1] += " " + lastWord;
		}

		let fontSize = 1,
			lines = [];

		this.context.textBaseline = "top";
		this.context.letterSpacing = "2px";

		while (
			(lines.length + 1) * (fontSize + 1) * lineHeight <
			quoteMaxHeight
		) {
			this.context.font = `${fontSize++}px 'Cormorant Garamond'`;

			lines = [""];
			let wordIndex = 0;

			do {
				const nextWord = words[wordIndex] + " ";

				if (
					this.context.measureText(lines[lines.length - 1] + nextWord)
						.width < quoteMaxWidth
				)
					lines[lines.length - 1] += nextWord;
				else lines.push(nextWord);
			} while (++wordIndex < words.length);
		}

		this.context.fillStyle = "white";

		const paddingTop =
			(quoteMaxHeight - lines.length * lineHeight * fontSize) / 2;

		lines.forEach((line, index) => {
			this.context.fillText(
				line,
				textOffsetLeft,
				quoteOffsetTop + index * fontSize * lineHeight + paddingTop
			);
		});
	};

	this.renderAuthor = function (text, color) {
		const fontSize = 36;

		this.context.fillStyle = color;
		this.context.font = `600 ${fontSize}px 'Avenir'`;
		this.context.letterSpacing = "10px";

		this.context.fillText(text, textOffsetLeft, authorOffsetTop);
	};
}
