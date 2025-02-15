import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar
} from "react-simple-wysiwyg";
import { AIChatSession } from "./../../../../service/AIModal";
import { toast } from "sonner";

const PROMPT =
  "position titile: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experince level and No JSON array) , give me result in HTML tags";

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || "");
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  // 1) Generate summary from AI
  const GenerateSummeryFromAI = async () => {
    // Must have a position title
    if (!resumeInfo?.experience?.[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    setLoading(true);

    try {
      const prompt = PROMPT.replace("{positionTitle}", resumeInfo.experience[index].title);
      const result = await AIChatSession.sendMessage(prompt);

      // ❗️We must await the text from the response
      const text = await result.response.text();
      // Optionally remove square brackets if present
      const cleaned = text.replace("[", "").replace("]", "");

      // Update local editor value
      setValue(cleaned);
      // Also notify parent that we have new text
      onRichTextEditorChange(cleaned);
    } catch (error) {
      console.error("Error in AI Generation:", error);
      toast("Failed to generate summary from AI.");
    } finally {
      setLoading(false);
    }
  };

  // 2) Handle editor changes
  const handleEditorChange = (e) => {
    // e is a DOM event, but e.target.value is the string we want
    const newValue = e.target.value;
    setValue(newValue);
    // Only pass the string, not the entire event
    onRichTextEditorChange(newValue);
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summery</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor value={value} onChange={handleEditorChange}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            {/* Additional toolbar buttons remain the same */}
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
