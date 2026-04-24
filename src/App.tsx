import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

const App = () => {
  const [todos, setTodos] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getTodos() {
      setLoading(true);
      setError("");

      try {
        const { data: todos, error: queryError } = await supabase
          .from("todos")
          .select();

        if (queryError) {
          setError(queryError.message);
          setTodos([]);
          return;
        }

        if (todos) {
          setTodos(todos as Array<{ id: string | number; name: string }>);
        } else {
          setTodos([]);
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load todos",
        );
        setTodos([]);
      } finally {
        setLoading(false);
      }
    }

    getTodos();
  }, []);

  if (loading) {
    return <p>Loading todos...</p>;
  }

  if (error) {
    return <p>Unable to load todos: {error}</p>;
  }

  return (
    <div>
      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
