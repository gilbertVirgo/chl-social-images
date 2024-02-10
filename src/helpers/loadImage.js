export default (src) =>
	new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.src = src;
	});
