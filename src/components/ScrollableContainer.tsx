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

        // Function to check if images are loaded and update arrows
        const checkImagesAndUpdate = () => {
            const images = container.querySelectorAll('img');
            if (images.length === 0) {
                // No images, update immediately
                updateScrollbar();
                return;
            }

            let loadedImages = 0;
            const totalImages = images.length;

            const onImageLoad = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    // All images loaded, update arrows
                    setTimeout(updateScrollbar, 100); // Small delay to ensure layout is complete
                }
            };

            images.forEach(img => {
                if (img.complete) {
                    onImageLoad();
                } else {
                    img.addEventListener('load', onImageLoad);
                    img.addEventListener('error', onImageLoad); // Handle error cases too
                }
            });
        };

        // Initial update with a small delay to allow for initial layout
        setTimeout(checkImagesAndUpdate, 50);

        // Set up MutationObserver to detect when content changes
        const observer = new MutationObserver(() => {
            setTimeout(checkImagesAndUpdate, 50);
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
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