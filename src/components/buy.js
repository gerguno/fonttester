export function Buy({ slug, buy, downloadLink = '' }) {
    const openBuyLink = () => {
        window.open(`https://www.kyivtypefoundry.com/${slug}/buy`, "_blank");
    }

    const openDownloadLink = () => {
        window.open(`${downloadLink}`, "_blank");
    }

    return (
        buy ? (
            <button onClick={openBuyLink} target="_blank">
                Buy
            </button>
        ) : (
            <button onClick={openDownloadLink} target="_blank">
                Download
            </button>
        )
    );
}