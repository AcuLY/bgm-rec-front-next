export const getOptimalFontSize = (text, maxWidth, maxHeight, fontFamily = 'sans-serif') => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.visibility = "hidden";
    container.style.whiteSpace = "normal"; // 允许换行
    container.style.lineHeight = "normal"; // 用默认行距
    container.style.width = `${maxWidth}px`;
    container.style.fontFamily = fontFamily;
    container.style.padding = "0";
    container.style.margin = "0";

    document.body.appendChild(container);

    let fontSize = Math.min(maxHeight, 64);

    while (fontSize > 0) {
        container.style.fontSize = `${fontSize}px`;
        container.innerText = text;

        const height = container.getBoundingClientRect().height;

        if (height <= maxHeight) {
            document.body.removeChild(container);
            return `${fontSize}px`;
        }

        fontSize--;
    }

    document.body.removeChild(container);
    return '1px';
};
