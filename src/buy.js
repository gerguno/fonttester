export function Buy({slug}) {
    const handleClick = () => {
        window.open(`https://www.kyivtypefoundry.com/${slug}/buy`, "_blank");
      };

    return (
        <a onClick={handleClick} target="_blank">Buy</a>
    )
}