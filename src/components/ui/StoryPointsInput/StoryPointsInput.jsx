import { Button } from "../button";
import { Progress } from "../progress"; // Assuming you use shadcn Progress
import { Minus, Plus } from "lucide-react"; // Icons from lucide-react
import { cn } from "../../../lib/utils"; // Optional if you want to merge classes

const steps = [null, 1, 2, 3, 5, 8, 13];

import React from 'react'

const StoryPointsInput = ({ value, onChange, className }) => {
  const currentIndex = steps.indexOf(value);

  const handleIncrement = () => {
    const nextIndex = Math.min(steps.length - 1, currentIndex + 1);
    onChange(steps[nextIndex]);
  };

  const handleDecrement = () => {
    const prevIndex = Math.max(0, currentIndex - 1);
    onChange(steps[prevIndex]);
  };

  const progressPercentage = currentIndex > 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className={cn("space-y-2", className)}>
      {/* First row */}
      <div className="flex items-center justify-center space-x-4">
        <Button type="button" variant="outline" size="icon" onClick={handleDecrement} disabled={currentIndex <= 0}>
          <Minus className="h-4 w-4" />
        </Button>

        <div className="text-lg font-semibold w-10 text-center">
          {value !== null ? value : "-"}
        </div>

        <Button type="button" variant="outline" size="icon" onClick={handleIncrement} disabled={currentIndex >= steps.length - 1}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Second row */}
      <Progress value={progressPercentage} />
    </div>
  );
}

export default StoryPointsInput
