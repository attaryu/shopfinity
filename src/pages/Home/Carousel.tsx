import Slider, { Settings } from 'react-slick';
import { ComponentChildren } from 'preact';

type Props = Readonly<{
  children: ComponentChildren,
  arrows?: boolean,
  dots?: boolean,
}>;

export default function Carousel({ children, arrows = false, dots = false }: Props) {
  const setting: Settings = {
    adaptiveHeight: true,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 3000,
    speed: 800,
    arrows,
    dots,
  };
  
  return (
    <Slider {...setting}>
      {children}
    </Slider>
  );
}