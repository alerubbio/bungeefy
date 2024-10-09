import React from 'react';
import { Slider, Button, SliderValue } from "@nextui-org/react";
import { useDashboard } from './DashboardContext';

const VolumeSlider: React.FC = () => {
  const { volume, setVolume } = useDashboard();
  const [value, setValue] = React.useState<SliderValue>(volume * 100);

  React.useEffect(() => {
    setVolume(Number(value) / 100);
  }, [value, setVolume]);

  return (
    <div className="flex flex-col w-half h-full max-w-md items-start justify-center">
      <Slider 
        aria-label="Volume"
        size="sm"
        color="foreground"
        value={value} 
        onChange={setValue}
        startContent={
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={() => setValue((prev) => Math.max(0, Number(prev) - 10))}
          >
            <span className="text-small inline-flex items-center justify-center w-5 h-5">

            <img 
          src="src/assets/volume-icon.png" 
          alt="Volume" 
          className="w-full h-full object-contain"
          />
          </span>
          </Button>
        }
        endContent={
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={() => setValue((prev) => Math.min(100, Number(prev) + 10))}
          >
          </Button>
        }
        className="max-w-md"
      />
      {/* <p className="text-default-500 font-medium text-small">Current volume: {Math.round(Number(value))}%</p> */}
    </div>
  );
};

export default VolumeSlider;