function downloadFile(content, fileName, mimeType = 'text/plain') {
    const blob = new Blob([content], {type: mimeType})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export default downloadFile