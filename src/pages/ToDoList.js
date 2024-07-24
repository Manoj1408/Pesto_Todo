import React, { useEffect, useState } from "react";
import ToDo from "../components/Todo";
import AddTaskForm from "../components/AddTaskForm";
import UpdateForm from "../components/UpdateForm";
import Header from "../components/common/Header";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";

function ToDoList() {
  const [toDo, setToDo] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updateData, setUpdateData] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, "todolists"),
          where("createdBy", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const toDoData = [];
        querySnapshot.forEach((doc) => {
          toDoData.push({ id: doc.id, ...doc.data() });
        });
        console.log("toDoData", toDoData);
        setToDo(toDoData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Error fetching tasks:", error.message);
      }
    }
  };

  const addTask = async () => {
    if (newTask) {
      try {
        const newToDo = {
          title: newTask,
          status: "todo",
          createdBy: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, "todolists"), newToDo);
        setToDo([...toDo, { id: docRef.id, ...newToDo }]);
        setNewTask("");
      } catch (error) {
        console.error("Error creating todo:", error);
        toast.error("Error creating todo:", error.message);
      }
    } else {
      toast.error("Please enter todo");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const taskDoc = doc(db, "todolists", id);
      await updateDoc(taskDoc, {
        status: newStatus,
      });

      const updatedTasks = toDo.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      );
      console.log("updatedTasks", updatedTasks);
      toast.success("Task Status changed");
      setToDo(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status:", error.message);
    }
  };

  const deleteTask = (id) => {
    let newTask = toDo.filter((task) => task.id !== id);
    setToDo(newTask);
  };

  const cancelUpdate = () => {
    setUpdateData("");
  };

  const changeTask = (e) => {
    let newEntry = {
      id: updateData.id,
      title: e.target.value,
      status: updateData.status,
    };
    setUpdateData(newEntry);
  };
const updateTask = async () => {
  const taskDoc = doc(db, "todolists", updateData.id);
  try {
    await updateDoc(taskDoc, {
      title: updateData.title,
      status: updateData.status,
    });
    const updatedTasks = toDo.map((task) =>
      task.id === updateData.id ? updateData : task
    );
    setToDo(updatedTasks);
    setUpdateData("");
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Error updating task:", error.message);
  }
};

  return (
    <>
      <Header />
      <div className="container App">
        <br />
        <h2>To Do list</h2>
        <br />

        {/* update data  */}
        {updateData && updateData ? (
          <UpdateForm
            updateData={updateData}
            changeTask={changeTask}
            updateTask={updateTask}
            cancelUpdate={cancelUpdate}
          />
        ) : (
          <AddTaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
          />
        )}

        {toDo && toDo.length ? " " : "No Task..."}

        <ToDo
          toDo={toDo}
          setUpdateData={setUpdateData}
          deleteTask={deleteTask}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </>
  );
}

export default ToDoList;
