import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useRouter } from "next/dist/client/router";
import { convertFromRaw, convertToRaw } from "draft-js";
import { useSession } from "next-auth/client";
import { useDocumentOnce } from "react-firebase-hooks/firestore";

/*
As the package uses the Window object only available in the browser, you have to do a "dynamic import" here
  to avoid the error "ReferenceError: window is not defined
*/
// import { Editor } from "react-draft-wysiwyg"; // ❌ Will not work
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
); // ✅

function TextEditor() {
  const [session] = useSession();
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Définit une structure vide d'un objet "Editor"
  const router = useRouter();
  const { id } = router.query;

  const [snapshot] = useDocumentOnce(
    db.collection("userDocs").doc(session.user.email).collection("docs").doc(id)
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  // Equivalent to an @input on the Editor
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    // Backup in Firebase;
    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .doc(id)
      .set(
        {
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        { merge: true }
      );
  };

  console.log(editorState);

  return (
    <div className="bg-gray-600 min-h-screen pb-16">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 px-20  py-24 bg-white shadow-lg max-w-5xl mx-auto mb-12 border min-h-screen"
      />
    </div>
  );
}

export default TextEditor;
