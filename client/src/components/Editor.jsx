import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

function Editor() {

  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      //* specifing the place where codemirror will be there is in textArea we get it through realtimeEditor id
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          scrollbarStyle: "simple",
          extraKeys: {
            "Ctrl-Enter": () => alert("Run code!"),
          },
        }
      );

      editor.setSize("100%", "100%");
      editor.setValue("// Start typing your code or English sentence here...");
      editorRef.current = editor;

      editor.on("change", () => {
        const text = editor.getValue();
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
      });
    };

    init();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <textarea id="realtimeEditor" />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "20px",
          color: "white",
          fontSize: "0.9rem",
        }}
      >
        Word Count: {wordCount}
      </div>
    </div>
  );
}

export default Editor;
