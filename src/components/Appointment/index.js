import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode.js";
import "components/Appointment/styles.scss"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "FORM";
  const SAVING = "SAVING";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY);
// show the interview when save successful, else go to the error page 
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {transition(ERROR_SAVE, true)
      });
  }
  // show the empty when delete successful, else go to the error page 
  function destroy(event) {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers} onSave={save} onCancel={() => back()}
        />
      )}
      {mode === SAVING && (
        <Status message={"Saving"} />
      )}
      {mode === DELETE && (
        <Status message={"Deleting"} />
      )}
      {mode === CONFIRM && (
        <Confirm onCancel={() => back()} onConfirm={destroy} />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer.id} onSave={save} onCancel={() => transition(SHOW)}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save the appointment." onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete the appointment." onClose={() => back()} />
      )}
    </article>
  )
}
