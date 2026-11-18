import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <main className="landing-page">
      <header className="site-nav">
        <Link className="wordmark" to="/" aria-label="Movie Club home">
          <span className="wordmark-icon" aria-hidden="true">
            M
          </span>
          MOVIE CLUB
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <Link className="nav-link" to="/login">
            Sign in
          </Link>
          <Link className="button button-outline" to="/signup">
            Create account
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            YOUR NEXT FAVORITE FILM
          </p>
          <h1>
            Stories worth
            <br />
            <span>staying in for.</span>
          </h1>
          <p className="hero-description">
            Find your next movie-night favorite, keep track of the films you
            love, and make every watch feel like an occasion.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/signup">
              Get started <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-action" to="/login">
              Already a member? <span>Sign in</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="note-line" aria-hidden="true" />
            <p>A little more magic in your movie nights.</p>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="poster poster-side poster-side-left">
            <span className="poster-kicker">A QUIET KIND OF</span>
            <span className="poster-side-title">wonder</span>
            <span className="poster-year">A FILM FOR THE FEELING</span>
          </div>
          <div className="poster poster-side poster-side-right">
            <span className="poster-kicker">SOMEWHERE</span>
            <span className="poster-side-title">between</span>
            <span className="poster-year">NIGHT &amp; MORNING</span>
          </div>
          <div className="poster poster-main">
            <span className="poster-main-label">TONIGHT&apos;S PICK</span>
            <div className="poster-sun" />
            <div className="poster-horizon" />
            <div className="poster-main-title">
              <span>the</span>
              <strong>afterglow</strong>
            </div>
            <span className="poster-main-caption">SOME STORIES STAY WITH US</span>
          </div>
          <div className="art-glow" />
        </div>
      </section>
    </main>
  );
};

export default Landing;
