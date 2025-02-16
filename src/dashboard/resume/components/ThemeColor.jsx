import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ThemeColor() {
  const colors = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#EEEEEE", // Black & Gray Shades
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF",
    "#FFB533", "#B5FF33", "#33FFB5", "#33B5FF", "#B533FF",
    "#FF33B5", "#FF8C33", "#8CFF33", "#33FF8C", "#338CFF",
    "#8C33FF", "#FF338C", "#FFDB33", "#DBFF33", "#33FFDB",
    "#33DBFF", "#DB33FF", "#FF33DB", "#FF6F33", "#6FFF33",
    "#33FF6F", "#336FFF", "#6F33FF", "#FF336F", "#FFD633",
    "#D6FF33", "#33FFD6", "#33D6FF", "#D633FF", "#FF33D6",
    "#FF9C33", "#9CFF33", "#33FF9C", "#339CFF", "#9C33FF",
    "#FF339C", "#FFF133", "#F1FF33", "#33FFF1", "#33F1FF",
    "#F133FF", "#FF33F1", "#FF4433", "#44FF33", "#33FF44",
    "#3344FF", "#4433FF", "#FF3344", "#FFCC33", "#CCFF33",
    "#33FFCC", "#33CCFF", "#CC33FF", "#FF33CC", "#FFAA33",
    "#AAFF33", "#33FFAA", "#33AAFF", "#AA33FF", "#FF33AA",
    "#FFEE33", "#EEFF33", "#33FFEE", "#33EEFF", "#EE33FF",
    "#FF33EE", "#FF8822", "#22FF88", "#8822FF", "#2288FF",
    "#88FF22", "#FF2288", "#F1A533", "#A5F133", "#33F1A5",
    "#33A5F1", "#A533F1", "#F133A5", "#FF7722", "#22FF77"
  ];
  
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();
  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themecolor || "#FF5733");

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    setResumeInfo({ ...resumeInfo, themecolor: color });

    try {
      await GlobalApi.UpdateThemeColor(resumeId, color);
      toast.success("✅ Theme color updated");
    } catch (error) {
      console.error("❌ Error updating theme color:", error);
      toast.error("❌ Failed to update theme color");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2"
        >
          <LayoutGrid /> 
          <span className="hidden md:inline">Theme</span>
          <div
            className="w-5 h-5 rounded-full border ml-2"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-4">
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-6 w-6 rounded-full cursor-pointer transition-all border ${
                selectedColor === item ? "border-2 border-black" : "hover:border-gray-600 sm:hover:border-black"
              }`}
              style={{ background: item }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
