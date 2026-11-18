import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Items } from "../types";
import Layout from "./Layout";
import { deleteMovie, getApiErrorMessage, getMovies } from "./apiService";
import Loading from "./loader/Loading";

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Items[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMovieId, setLoadingMovieId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setIsLoading(true);
      setError("");
      try {
        const response = await getMovies();
        if (active) {
          setMovies(response);
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load movies."));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();
    return () => {
      active = false;
    };
  }, [refresh]);

  const handleDelete = async (id: string) => {
    setLoadingMovieId(id);
    setError("");
    setNotice("");

    try {
      await deleteMovie(id);
      setNotice("Movie deleted.");
      setRefresh((current) => current + 1);
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to delete movie."));
    } finally {
      setLoadingMovieId(null);
    }
  };

  return (
    <Layout title="My movies">
      <header className="movies-heading">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h1>My movies</h1>
        </div>
        <Link className="button button-primary" to="/add">
          Add a movie <span aria-hidden="true">+</span>
        </Link>
      </header>

      <div className="movie-list-toolbar">
        <p>Keep track of the stories you want to remember.</p>
        <button
          className="button button-outline"
          disabled={isLoading}
          onClick={() => setRefresh((current) => current + 1)}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="error-msg" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="success-msg" role="status">
          {notice}
        </p>
      )}

      {isLoading ? (
        <Loading />
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h2>No movies yet</h2>
          <p>Add your first movie to start your collection.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <article className="movie-card" key={movie.movie_id}>
              <div className="movie-card-art" aria-hidden="true">
                <span>MC</span>
              </div>
              <div className="movie-card-content">
                <h2>{movie.movie_name}</h2>
                <p>{movie.year || "Year not set"}</p>
                <div className="movie-card-actions">
                  <Link
                    className="button button-outline"
                    to={`/edit/${movie.movie_id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="button button-danger"
                    disabled={loadingMovieId === movie.movie_id}
                    onClick={() => handleDelete(movie.movie_id)}
                  >
                    {loadingMovieId === movie.movie_id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MovieList;
