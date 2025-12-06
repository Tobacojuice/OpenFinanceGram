import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTour } from "@/hooks/useTour";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TutorialButton = () => {
  const { startTour } = useTour();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={startTour}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 bg-primary text-primary-foreground border-primary"
            data-tour="tutorial-button"
          >
            <GraduationCap className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Start Tutorial</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
