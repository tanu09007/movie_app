import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Movie1 } from "../types";
import {
  getApiErrorMessage,
  getMovieById,
  updateMovie,
} from "./apiService";
import Layout from "./Layout";
import MovieForm from "./MovieForm";
import Loading from "./loader/Loading";

const EditMovie: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialMovie, setInitialMovie] = useState<Movie1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMovie() {
      if (!id) {
        setError("Movie id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const movie = await getMovieById(id);
        if (active) {
          setInitialMovie(movie);
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load movie."));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();
    return () => {
      active = false;
    };
  }, [id]);

  const handleMovieUpdated = async (movie: Movie1) => {
    if (!id) {
      setError("Movie id is missing.");
      return;
    }

    setError("");
    try {
      await updateMovie(id, movie);
      navigate("/movielist");
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to update movie."));
    }
  };

  return (
    <Layout title="Edit movie">
      <section className="movie-editor">
        <Link className="auth-back" to="/movielist">
          <span aria-hidden="true">←</span> Back to my movies
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">UPDATE YOUR COLLECTION</p>
          <h1>Edit movie</h1>
          <p>Update the title or release year.</p>
        </div>
        {error && (
          <p className="error-msg" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <Loading />
        ) : (
          initialMovie && (
            <MovieForm
              onSubmit={handleMovieUpdated}
              initialMovie={initialMovie}
            />
          )
        )}
      </section>
    </Layout>
  );
};

export default EditMovie;
