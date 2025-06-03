import React, { useRef, useEffect } from 'react';

interface ScrollableContainerProps {
    children: React.ReactNode;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const scrollbar = scrollbarRef.current;
        if (!container || !scrollbar) return;

        const updateScrollbar = () => {
            const { scrollWidth, clientWidth, scrollLeft } = container;
            const scrollbarWidth = (clientWidth / scrollWidth) * clientWidth;
            const scrollbarLeft = (scrollLeft / scrollWidth) * clientWidth;
            
            scrollbar.style.width = `${scrollbarWidth}px`;
            scrollbar.style.transform = `translateX(${scrollbarLeft}px)`;
        };

        const handleScroll = () => {
            requestAnimationFrame(updateScrollbar);
        };

        const handleResize = () => {
            requestAnimationFrame(updateScrollbar);
        };

        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        updateScrollbar(); // Initial update

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="scrollable-wrapper" style={{ position: 'relative', width: '100%' }}>
            <div ref={containerRef} className="item2">
                {children}
            </div>
            <div 
                ref={scrollbarRef}
                className="custom-scrollbar"
                style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    height: '8px',
                    background: '#CBCBCB',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                }}
            />
        </div>
    );
};

export default ScrollableContainer; 