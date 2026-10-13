
import './App.css'

function homepage({ onNavigate, currentUser, onOpenAuth, onLogout }) {
  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <span className="logo-icon">✳</span>
          SharePlate
        </a>

        <nav className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Our impact</a>
        </nav>

        <div className="nav-actions">
          {currentUser ? (
            <div className="user-badge">
              <span>{currentUser.name}</span>
              <span className={`role-pill role-${currentUser.role.toLowerCase()}`}>
                {currentUser.role}
              </span>
              <button className="logout-button" onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={onOpenAuth}>
              Log in
            </button>
          )}
          <button className="nav-donate" onClick={() => onNavigate('donate')}>Donate food ↗</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              GOOD FOOD. BETTER FUTURE.
            </div>

            <h1>
              Good food deserves
              <br />
              a <span>second chance.</span>
            </h1>

            <p className="hero-description">
              Connecting surplus food with the people who need it.
              Join us in reducing food waste and making every meal count.
            </p>

            <div className="hero-actions">
            <button
                className="primary-button"
                onClick={() => onNavigate('donate')}
            >
                Donate food <span>↗</span>
            </button>
            <button
                className="secondary-button"
                onClick={() => onNavigate('find')}
            >
                Find food <span>→</span>
            </button>
            </div>

            <div className="trust-note">
              <span className="trust-icon">✓</span>
              Together, we can make a difference.
            </div>
          </div>

          <div className="hero-visual">
            <div className="image-frame">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=85"
                alt="A fresh, colorful meal made with wholesome ingredients"
              />
              <div className="image-label">
                <span className="label-icon">♥</span>
                <div>
                  <strong>Every meal matters</strong>
                  <p>Small actions. Big impact.</p>
                </div>
              </div>
            </div>

            <div className="floating-badge">
              <span className="badge-icon">♧</span>
              <div>
                <strong>Food is precious.</strong>
                <p>Let's waste less.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-strip" id="impact">
          <div>
            <span className="impact-number">01</span>
            <div>
              <strong>Reduce food waste</strong>
              <p>Give surplus meals a purpose.</p>
            </div>
          </div>

          <div>
            <span className="impact-number">02</span>
            <div>
              <strong>Connect communities</strong>
              <p>Bring donors and recipients together.</p>
            </div>
          </div>

          <div>
            <span className="impact-number">03</span>
            <div>
              <strong>Create real impact</strong>
              <p>Make every available meal count.</p>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <p className="section-eyebrow">SIMPLE. THOUGHTFUL. IMPACTFUL.</p>
          <h2>Good things happen when food is shared.</h2>
          <p>
            From surplus food to meaningful meals, every connection starts
            with one small action.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="logo">
          <span className="logo-icon">✳</span>
          SharePlate
        </a>
        <p>Sharing food. Nourishing communities.</p>
      </footer>
    </div>
  )
}

export default homepage
