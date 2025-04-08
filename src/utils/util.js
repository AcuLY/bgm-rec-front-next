export const getOptimalFontSize = (text, maxWidth, maxHeight, fontWeight, fontFamily = 'Microsoft YaHei UI') => {
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.visibility = "hidden"
    container.style.whiteSpace = "pre-wrap";
    container.style.wordBreak = "break-word";
    container.style.overflowWrap = "break-word";
    container.style.display = "inline-block";
    container.style.fontWeight = fontWeight
    container.style.lineHeight = "normal"
    container.style.width = `${maxWidth}px`
    container.style.fontFamily = fontFamily
    container.style.padding = "0"
    container.style.margin = "0"

    document.body.appendChild(container)

    let fontSize = Math.min(maxHeight, 64)

    while (fontSize > 0) {
        container.style.fontSize = `${fontSize}px`
        container.innerText = text

        const height = container.getBoundingClientRect().height

        if (height <= maxHeight) {
            document.body.removeChild(container)
            return `${fontSize}px`
        }

        fontSize--
    }

    document.body.removeChild(container)
    return '1px'
}
