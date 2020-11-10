import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { MdDelete, MdInfoOutline, MdDone } from 'react-icons/md';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const initialState = {
  isLoading: false,
  todos: [],
  error: null,
};

const ASYNC_START = 'ASYNC_START';
const GET_TODOS_SUCCESS = 'GET_TODOS_SUCCESS';
const GET_TODOS_FAILED = 'GET_TODOS_FAILED';
const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
const COMPLETE_TODO_SUCCESS = 'COMPLETE_TODO_SUCCESS';
const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';

function reducer(state = initialState, action) {
  switch (action.type) {
    case ASYNC_START:
      return {
        ...state,
        isLoading: true,
      };
    case GET_TODOS_SUCCESS:
      return {
        isLoading: false,
        todos: action.todos,
        error: null,
      };
    case GET_TODOS_FAILED:
      return {
        isLoading: false,
        todos: [],
        error: action.error,
      };
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        todos: state.todos.concat([action.todo]),
      };
    case COMPLETE_TODO_SUCCESS: {
      const todos = [...state.todos];
      const i = todos.findIndex((p) => p.id === action.todoId);
      todos[i].completed = true;
      return {
        ...state,
        todos,
        isLoading: false,
      };
    }
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter((p) => p.id !== action.todoId),
        isLoading: false,
      };

    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isLoading, error, todos } = state;

  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  const { token } = useSelector((s) => s.auth);

  const { register, errors, handleSubmit } = useForm();

  const titleRef = register({
    required: {
      value: true,
      message: 'Title is required',
    },
    minLength: {
      value: 5,
      message: 'Title must have at least 5 chars',
    },
    maxLength: {
      value: 100,
      message: 'Title must have at most 100 chars',
    },
  });

  const descriptionRef = register({
    minLength: {
      value: 5,
      message: 'Description must have at least 5 chars',
    },
    maxLength: {
      value: 255,
      message: 'Description must have at most 255 chars',
    },
  });

  const getTodos = useCallback(async () => {
    dispatch({ type: ASYNC_START });
    try {
      const { data } = await api.get('/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: GET_TODOS_SUCCESS, todos: data });
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : err.message;
      dispatch({ type: GET_TODOS_FAILED, error: errorMessage });
    }
  }, [token]);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  const openCreateModal = useCallback(() => {
    setShowCreateItemModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateItemModal(false);
  }, []);

  const handleAddTodo = useCallback(
    async (data, e) => {
      e.preventDefault();
      dispatch({ type: ASYNC_START });
      try {
        const { data: todo } = await api.post('/todos', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: ADD_TODO_SUCCESS, todo });
        closeCreateModal();
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        Swal.fire('Error!', errorMessage, 'error');
      }
    },
    [token, closeCreateModal],
  );

  const showDetailsModal = useCallback((todo) => {
    setShowItemDetailsModal(true);
    setSelectedTodo(todo);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowItemDetailsModal(false);
  }, []);

  const handleCompleteTodo = useCallback(
    async (todoId) => {
      dispatch({ type: ASYNC_START });
      try {
        await api.patch(
          `/todos/${todoId}/complete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        dispatch({ type: COMPLETE_TODO_SUCCESS, todoId });
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        Swal.fire('Error!', errorMessage, 'error');
      }
    },
    [token],
  );

  const handleDeleteTodo = useCallback(
    async (todoId) => {
      dispatch({ type: ASYNC_START });
      try {
        await api.delete(`/todos/${todoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: DELETE_TODO_SUCCESS, todoId });
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        Swal.fire('Error!', errorMessage, 'error');
      }
    },
    [token],
  );

  let content = null;

  if (isLoading) {
    content = (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
  } else if (error) {
    content = <Alert variant="danger">Error: {error}</Alert>;
  } else if (todos.length) {
    content = (
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex align-items-center justify-content-between"
          >
            <span>{todo.title}</span>
            <div>
              {!todo.completed && (
                <Button
                  size="sm p-1"
                  variant="success"
                  title="Complete"
                  onClick={() => handleCompleteTodo(todo.id)}
                >
                  <MdDone size={20} />
                </Button>
              )}
              <Button
                size="sm p-1 mx-1"
                variant="primary"
                title="Info"
                onClick={() => showDetailsModal(todo)}
              >
                <MdInfoOutline size={20} />
              </Button>
              <Button
                size="sm p-1"
                variant="danger"
                title="Delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <MdDelete size={20} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  } else {
    content = <Alert variant="secondary">No Todos Yet</Alert>;
  }

  return (
    <section className="my-4 container">
      <div className="row">
        <div className="col-12">
          <div className="card rounded-lg">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h3 text-primary">Todos</h2>
                <Button variant="success" onClick={openCreateModal}>
                  New
                </Button>
              </div>
              {content}
            </div>
          </div>
        </div>
        <Modal show={showCreateItemModal} onHide={closeCreateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Todo</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(handleAddTodo)}>
            <Modal.Body>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  ref={titleRef}
                  placeholder="Todo Title"
                />
                {errors.title && (
                  <span
                    style={{ fontSize: '0.8em' }}
                    className="text-danger font-weight-bolder"
                  >
                    {errors.title.message}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  ref={descriptionRef}
                  placeholder="Todo Description"
                />
                {errors.description && (
                  <span
                    style={{ fontSize: '0.8em' }}
                    className="text-danger font-weight-bolder"
                  >
                    {errors.description.message}
                  </span>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeCreateModal}>
                Close
              </Button>
              <Button type="submit" variant="success" disabled={isLoading}>
                Create
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal show={showItemDetailsModal} onHide={closeDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Todo Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-1 font-weight-bolder">Title</p>
            <p>{selectedTodo?.title}</p>
            <p className="text-muted mb-1 font-weight-bolder">Description</p>
            <p>{selectedTodo?.description}</p>
            <p className="text-muted mb-1 font-weight-bolder">Status</p>
            {selectedTodo?.completed ? (
              <p className="text-success font-weight-bolder">Completed</p>
            ) : (
              <p className="text-danger font-weight-bolder">Open</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeDetailsModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}
