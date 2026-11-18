import React, { useState } from "react";
import { Movie1 } from "../types";

interface MovieFormProps {
  onSubmit: (movie: Movie1) => Promise<void>;
  initialMovie?: Movie1;
}

const currentYear = new Date().getFullYear();

const MovieForm: React.FC<MovieFormProps> = ({ onSubmit, initialMovie }) => {
  const [movie, setMovie] = useState<Movie1>(
    initialMovie || { title: "", year: currentYear }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((current) => ({ ...current, title: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((current) => ({ ...current, year: Number(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(movie);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="movie-title">Movie title</label>
        <input
          id="movie-title"
          type="text"
          value={movie.title}
          onChange={handleTitleChange}
          placeholder="e.g. The Grand Budapest Hotel"
          maxLength={255}
          required
        />
      </div>
      <div className="auth-field">
        <label htmlFor="movie-year">Release year</label>
        <input
          id="movie-year"
          type="number"
          value={movie.year}
          onChange={handleYearChange}
          min={1888}
          max={currentYear + 5}
          required
        />
      </div>
      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? initialMovie
            ? "Saving..."
            : "Adding..."
          : initialMovie
            ? "Save changes"
            : "Add movie"}
      </button>
    </form>
  );
};

export default MovieForm;
