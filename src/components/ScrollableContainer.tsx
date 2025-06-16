import React, { useRef, useEffect, useState } from 'react';

interface ScrollableContainerProps {
    children: React.ReactNode;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

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

            // Update arrow visibility with a small buffer
            setShowLeftArrow(scrollLeft > 5); // Buffer of 5px
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // Buffer of 5px
        };

        const handleScroll = () => {
            requestAnimationFrame(updateScrollbar);
        };

        const handleResize = () => {
            requestAnimationFrame(updateScrollbar);
        };

        const scrollLeft = () => {
            if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' });
            }
        };

        const scrollRight = () => {
            if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' });
            }
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
            {showLeftArrow && (
                <button 
                    className="scroll-arrow left-arrow"
                    onClick={() => containerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                    aria-label="Scroll left"
                >
                    ←
                </button>
            )}
            <div ref={containerRef} className="item2">
                {children}
            </div>
            {showRightArrow && (
                <button 
                    className="scroll-arrow right-arrow"
                    onClick={() => containerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                    aria-label="Scroll right"
                >
                    →
                </button>
            )}
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