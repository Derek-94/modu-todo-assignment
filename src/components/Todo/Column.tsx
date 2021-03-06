import React from 'react';
import styled from 'styled-components';
import Todo from 'components/Todo/Todo';
import { Itodo, StatusKey } from 'types';
import { findById, mergeArray } from 'utils/dnd';
import { useDragDispatch } from 'contexts/DragContext';
import { dateFormatString } from 'utils/date';

interface ColumnProps {
  status: StatusKey;
  todos: Itodo[];
  filtered: Itodo[];
  setTodoState: React.Dispatch<React.SetStateAction<Itodo[]>>;
  onDeleteTodo: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  status,
  todos,
  filtered,
  setTodoState,
  onDeleteTodo,
}) => {
  const dispatch = useDragDispatch();
  const handlerDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    dispatch({ type: 'SET_HOVER', hover: null });
  };

  const moveLast = (e: React.DragEvent<HTMLDivElement>) => {
    const targetId = e.dataTransfer.getData('id');
    const from = findById(todos, targetId);
    const newTodo = {
      ...todos[from],
      status: status,
      updatedAt: dateFormatString(new Date()),
    };

    const newTodos = mergeArray(todos, from, todos.length, newTodo);
    setTodoState(newTodos);
    dispatch({ type: 'SET_HOVER', hover: null });
  };

  return (
    <ColumnContatiner>
      <h2>{status}</h2>
      <Todos
        onDragOver={handlerDragOver}
        onDrop={moveLast}
        data-status={status}
      >
        {filtered.map(todo => (
          <Todo
            setTodoState={setTodoState}
            todos={todos}
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </Todos>
    </ColumnContatiner>
  );
};

const ColumnContatiner = styled.div`
  box-sizing: border-box;
  min-width: 300px;
  min-height: 60vh;
  width: 30%;
  padding: ${({ theme }) => theme.layout.padding};
  color: ${({ theme }) => theme.color.todoFont};
  border-radius: ${({ theme }) => theme.layout.radius};
  background-color: ${({ theme }) => theme.color.columnBackground};
  > h2 {
    font-size: ${({ theme }) => theme.layout.subTitleSize};
    font-weight: ${({ theme }) => theme.layout.fontBold};
    padding-left: ${({ theme }) => theme.layout.padding};
  }
`;

const Todos = styled.div`
  margin-top: ${({ theme }) => theme.layout.gap};
  height: 100%;
`;

export default Column;
