import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

function Editor({ socketRef, roomId, username }) {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          scrollbarStyle: "simple",
        }
      );

      editorRef.current = editor; // ✅ store the instance
      editor.setSize("100%", "100%");
      editor.setValue("// Start typing your code...");

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        if (origin !== "setValue") {
          socketRef.current.emit("code-change", { code, roomId });
        }
      });
    };

    init();
  }, [socketRef, roomId]);

  // ✅ Listen for changes from others
  useEffect(() => {
    if (!socketRef.current) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null && editorRef.current) {
        editorRef.current.setValue(code);
      }
    };

    socketRef.current.on("code-change", handleCodeChange);

    // cleanup on unmount
    return () => {
      socketRef.current.off("code-change", handleCodeChange);
    };
  }, [socketRef]);

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
