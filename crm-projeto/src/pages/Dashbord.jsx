import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Dashbord.css";


const DashboardPropostas = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startList = Array.from(tasks[source.droppableId]);
    const [moved] = startList.splice(source.index, 1);
    const endList = Array.from(tasks[destination.droppableId]);
    endList.splice(destination.index, 0, moved);

    setTasks({
      ...tasks,
      [source.droppableId]: startList,
      [destination.droppableId]: endList,
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Painel de Propostas</h1>

      {/* Cards de status */}
      <div className="status-cards">
        <div className="card recebidos">
          <h3>Recebidas</h3>
          <div
            className="progress-bar"
            style={{ width: `${tasks.recebidos.length * 20}%` }}
          />
          <p>{tasks.recebidos.length} propostas aguardando processamento</p>
        </div>
        <div className="card validar">
          <h3>Para Validar</h3>
          <div
            className="progress-bar validar-bar"
            style={{ width: `${tasks.validar.length * 25}%` }}
          />
          <p>{tasks.validar.length} propostas aguardando revisão</p>
        </div>
        <div className="card finalizadas">
          <h3>Finalizadas</h3>
          <div
            className="progress-bar finalizadas-bar"
            style={{ width: `${tasks.finalizadas.length * 33}%` }}
          />
          <p>{tasks.finalizadas.length} propostas concluídas</p>
        </div>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-container">
          {Object.entries(tasks).map(([status, lista]) => (
            <div className="kanban-column" key={status}>
              <h2 className={status}>{status}</h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="task-list"
                  >
                    {lista.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided2) => (
                          <div
                            ref={provided2.innerRef}
                            {...provided2.draggableProps}
                            {...provided2.dragHandleProps}
                            className={`task-card ${status}`}
                          >
                            <strong className="task-name">{task.nome}</strong>
                            <p className="task-desc">{task.descricao}</p>
                            <div className="task-footer">
                              <div className="avatar">
                                {task.nome.charAt(0)}
                              </div>
                              <span className="task-id">ID: {task.id}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DashboardPropostas;
