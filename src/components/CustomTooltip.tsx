import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

type CustomTooltipProps = {
  trigger: React.ReactNode
  content: React.ReactNode
}

// Functional component that renders a custom tooltip with the provided trigger and content elements
const CustomToltip: React.FC<CustomTooltipProps> = ({ trigger, content }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className="flex gap-1 cursor-help">
                {trigger}
            </TooltipTrigger>
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default CustomToltip
