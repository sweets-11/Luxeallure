import React, { useState } from 'react';
import './_slider.scss'; // Import your CSS file for styling
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CarouselProps {
  images: string[];
  server: string;
  video: string | null; // Make video optional
}

export const ProductCarousel: React.FC<CarouselProps> = ({ images, server, video }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = video ? [...images, 'video'] : images; // Create a list of items including the video

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  return (
    <div className="carousel">
      {items.length > 1 && (
        <button className="left-arrow" onClick={prevSlide}>
          <ArrowBackIosIcon sx={{ fontSize: 30 }} />
        </button>
      )}
      <div className="slide">
        {items[currentIndex] === 'video' ? (
          <video controls>
            <source src={`${server}/${video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={`${server}/${items[currentIndex]}`} alt={`Slide ${currentIndex}`} />
        )}
      </div>
      {items.length > 1 && (
        <button className="right-arrow" onClick={nextSlide}>
          <ArrowForwardIosIcon sx={{ fontSize: 30 }} />
        </button>
      )}
    </div>
  );
};
