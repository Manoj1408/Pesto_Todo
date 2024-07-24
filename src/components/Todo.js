import React from "react";

const ToDo = ({ toDo, handleStatusChange, setUpdateData, deleteTask }) => {
  return (
    <div className="tasks">
      {toDo &&
        toDo
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((task, index) => {
            return (
              <div key={task.id} className="task">
                <div className="taskBg">
                  <div
                    className={
                      task.status === "completed"
                        ? "done taskdisplay"
                        : "taskdisplay"
                    }
                  >
                    <span className="teskNumber">{index + 1}</span>
                    <span className="teskText">{task.title}</span>
                  </div>
                  <div className="leftPart">
                    <div className="iconsWrap">
                      {task.status === "completed" ? null : (
                        <span
                          className="Edit"
                          onClick={() =>
                            setUpdateData({
                              id: task.id,
                              title: task.title,
                              status: task.status,
                            })
                          }
                        >
                          <i class="bx bxs-edit-alt"></i>
                        </span>
                      )}
                      <span
                        className="Delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        <i class="bx bxs-trash"></i>
                      </span>
                    </div>
                    <select
                      name="status"
                      id="status"
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      <option value={"todo"}>ToDo</option>
                      <option value={"In-Process"}>In Process</option>
                      <option value={"completed"}>Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ToDo;
