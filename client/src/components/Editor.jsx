import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

function Editor({ socket, roomId }) {
  const editorRef = useRef(null);

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
        // only emit user-initiated changes (not setValue calls)
        if (origin !== "setValue") {
          if (socket && socket.connected)
            socket.emit("code-change", { code, roomId });
        }
      });
    };

    init();
  }, [socket, roomId]);

  // ✅ Listen for changes from others
  useEffect(() => {
    if (!socket) return;

    const handleCodeChange = ({ code }) => {
      if (code !== null && editorRef.current) {
        // setValue will mark origin so local 'change' won't re-emit
        editorRef.current.setValue(code);
      }
    };

    socket.on("code-change", handleCodeChange);

    // cleanup on unmount or socket change
    return () => {
      socket.off("code-change", handleCodeChange);
    };
  }, [socket]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <textarea id="realtimeEditor" />
      {/* optional UI can go here */}
    </div>
  );
}

export default Editor;
