import { useState } from 'react'
const Package = ({img}) => {

    const [myStyle, setStyle] = useState({ transform: "" })

    const motionMatchMedia = window.matchMedia("(prefers-reduced-motion)");
    const THRESHOLD = 15;

    function handleHover(e) {
        const { clientX, clientY, currentTarget } = e;
        const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

        const horizontal = (clientX - offsetLeft) / clientWidth;
        const vertical = (clientY - offsetTop) / clientHeight;
        const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
        const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

        let transformStyle = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
        setStyle({ transform: transformStyle });
    }

    function resetStyles(e) {
        let transformStyle = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
        setStyle({ transform: transformStyle });
    }

    const handlemove = (e) => { if (!motionMatchMedia.matches) handleHover(e) }
    const handleleave = (e) => { if (!motionMatchMedia.matches) resetStyles(e) }

    return <img onMouseMove={(e) => handlemove(e)}
            onMouseLeave={(e) => handleleave(e)}
            className="nft-img"
            style={myStyle}
            src={img} alt="" />
}
export default Package