import React from "react";
import { Slider, SliderValue } from "@nextui-org/react";
import { useDashboard } from "./DashboardContext";

const VolumeSlider: React.FC = () => {
  const { volume, setVolume } = useDashboard();
  const [value, setValue] = React.useState<SliderValue>(volume * 100);

  React.useEffect(() => {
    setVolume(Number(value) / 100);
  }, [value, setVolume]);

  return (
    <div className="flex flex-col items-end w-full pt-2 pr-5">
      <div className="flex items-center w-1/3 max-w-xs">
        <div className="flex-shrink-0 mr-2">
          <img
            src="src/assets/volume-icon.png"
            alt="Volume"
            className="w-5 h-5 object-contain"
          />
        </div>
        <Slider
          aria-label="Volume"
          size="sm"
          color="success"
          value={value}
          onChange={setValue}
          className="flex-grow"
        />
      </div>
      <p className="text-default-500 font-medium text-small mt-1 text-right p-0">
        Volume: {Math.round(Number(value))}%
      </p>
    </div>
  );
};

export default VolumeSlider;