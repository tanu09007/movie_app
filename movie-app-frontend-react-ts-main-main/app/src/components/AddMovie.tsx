import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Movie1 } from "../types";
import { createMovie, getApiErrorMessage } from "./apiService";
import Layout from "./Layout";
import MovieForm from "./MovieForm";

const AddMovie: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleMovieAdded = async (movie: Movie1) => {
    setError("");
    try {
      await createMovie(movie);
      navigate("/movielist");
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to add movie."));
    }
  };

  return (
    <Layout title="Add a movie">
      <section className="movie-editor">
        <Link className="auth-back" to="/movielist">
          <span aria-hidden="true">←</span> Back to my movies
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">GROW YOUR COLLECTION</p>
          <h1>Add a movie</h1>
          <p>Save a film you want to remember.</p>
        </div>
        {error && (
          <p className="error-msg" role="alert">
            {error}
          </p>
        )}
        <MovieForm onSubmit={handleMovieAdded} />
      </section>
    </Layout>
  );
};

export default AddMovie;
