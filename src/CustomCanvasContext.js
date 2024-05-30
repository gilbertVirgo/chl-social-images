import {
	authorOffsetTop,
	canvasWidth,
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
			offsetLeft - blurAmount * scale, // Account for bleed around edges due to blur
			offsetTop - blurAmount * scale,
			originalWidth * scale + blurAmount * 2 * scale,
			originalHeight * scale + blurAmount * 2 * scale
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
			lines = [],
			wordsCache;

		this.context.textBaseline = "top";
		this.context.letterSpacing = "5px";
		this.context.textAlign = "center";

		while (
			(lines.length + 1) * (fontSize + 1) * lineHeight <
			quoteMaxHeight
		) {
			this.context.font = `${fontSize++}px 'Cormorant Garamond'`;

			// Copy of the original array so that we don't mutate it
			wordsCache = [...words];

			// In the rare case of the final line (with the fake double-space)
			// exceeds the max width, break the two words apart again.
			if (
				this.context.measureText(wordsCache[wordsCache.length - 1])
					.width > quoteMaxWidth
			) {
				const [penultimateWord, finalWord] =
					wordsCache[wordsCache.length - 1].split(" ");
				wordsCache[wordsCache.length - 1] = penultimateWord;
				wordsCache.push(finalWord);
			}

			lines = [""];
			let wordIndex = 0;

			do {
				const nextWord = wordsCache[wordIndex] + " ";

				if (
					this.context.measureText(lines[lines.length - 1] + nextWord)
						.width < quoteMaxWidth
				)
					lines[lines.length - 1] += nextWord;
				else lines.push(nextWord);
			} while (++wordIndex < wordsCache.length);
		}

		this.context.fillStyle = "white";

		const paddingTop =
			(quoteMaxHeight - lines.length * lineHeight * fontSize) / 2;

		lines.forEach((line, index) => {
			this.context.fillText(
				line,
				canvasWidth / 2,
				quoteOffsetTop + index * fontSize * lineHeight + paddingTop
			);
		});
	};

	this.renderAuthor = function (text, color) {
		const fontSize = 24;

		this.context.fillStyle = color;
		this.context.font = `600 ${fontSize}px 'Avenir'`;
		this.context.letterSpacing = "10px";

		this.context.fillText(text, canvasWidth / 2, authorOffsetTop);
	};
}
