import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 600) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]); // Re-run the effect if the breakpoint changes

    return isMobile;
};

export default useIsMobile;