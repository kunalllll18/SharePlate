import { useState, useEffect, useCallback } from 'react'
import HomePage from './homepage.jsx'
import AuthModal from './components/AuthModal.jsx'
import { fetchFoods, createFood, claimFoodApi } from './api.js'
import './App.css'

function PageHeader({ onNavigate, currentPage, currentUser, onOpenAuth, onLogout }) {
  return (
    <header className="page-header">
      <button
        className="page-logo"
        onClick={() => onNavigate('home')}
      >
        <span>✳</span> SharePlate
      </button>

      <nav className="page-nav">
        <button
          className={currentPage === 'find' ? 'active' : ''}
          onClick={() => onNavigate('find')}
        >
          Find Food
        </button>

        <button
          className={currentPage === 'donate' ? 'active' : ''}
          onClick={() => onNavigate('donate')}
        >
          Donate Food
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        <button
          className="back-home-button"
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
      </div>
    </header>
  )
}

function getPickupInfo(deadline) {
  if (!deadline) {
    return {
      label: "Deadline not set",
      className: "pickup-normal",
    };
  }

  const now = new Date();
  const pickupTime = new Date(deadline);
  const diffMs = pickupTime - now;
  const hoursLeft = diffMs / (1000 * 60 * 60);

  if (Number.isNaN(pickupTime.getTime())) {
    return {
      label: "Deadline not set",
      className: "pickup-normal",
    };
  }

  if (diffMs <= 0) {
    return {
      label: "Expired",
      className: "pickup-expired",
    };
  }

  const remainingHours = Math.floor(diffMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeStr = `${remainingHours}h ${remainingMinutes}m remaining`;

  if (hoursLeft <= 2) {
    return {
      label: `Urgent (${timeStr})`,
      className: "pickup-urgent",
    };
  }

  if (hoursLeft <= 6) {
    return {
      label: `Pickup soon (${timeStr})`,
      className: "pickup-soon",
    };
  }

  return {
    label: `Available (${timeStr})`,
    className: "pickup-normal",
  };
}

function FindFoodPage({
  foods,
  onNavigate,
  onClaim,
  loading,
  error,
  onRetry,
  claimingId,
  bannerMessage,
  onCloseBanner,
  currentUser,
  onOpenAuth,
  onLogout,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All locations");

  const locations = [
    "All locations",
    ...new Set(foods.map((food) => food.location).filter(Boolean)),
  ];

  const filteredFoods = foods.filter((food) => {
    const search = searchText.toLowerCase().trim();

    const matchesSearch =
      (food.name || "").toLowerCase().includes(search) ||
      (food.donor || "").toLowerCase().includes(search) ||
      (food.location || "").toLowerCase().includes(search);

    const matchesLocation =
      selectedLocation === "All locations" ||
      food.location === selectedLocation;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "Available" && food.status === "Available") ||
      (statusFilter === "Claimed" && food.status === "Claimed");

    return matchesSearch && matchesLocation && matchesStatus;
  });

  return (
    <>
      <PageHeader
        onNavigate={onNavigate}
        currentPage="find"
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      <main className="app-page">
        <div className="page-intro">
          <h1>Find Available Food</h1>
          <p>Discover surplus food prioritized by urgency to prevent waste.</p>
        </div>

        {bannerMessage && (
          <div className="alert-banner alert-success">
            <span>{bannerMessage}</span>
            <button
              className="alert-close"
              onClick={onCloseBanner}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-error">
            <span>{error}</span>
            <button className="retry-button" onClick={onRetry}>
              Retry
            </button>
          </div>
        )}

        <div className="food-filters">
          <input
            type="text"
            placeholder="Search food, donor, or area..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search food or donor"
          />

          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            aria-label="Filter by location"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-row-secondary">
          <div className="status-tabs">
            {['ALL', 'Available', 'Claimed'].map((st) => (
              <button
                key={st}
                className={`status-tab ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'ALL' ? 'All Listings' : st}
              </button>
            ))}
          </div>

          <div className="sort-selector">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="urgency">Expiry urgency (soonest first)</option>
              <option value="newest">Newest listings</option>
            </select>
          </div>
        </div>

        <p className="results-count">
          Showing {filteredFoods.length} of {foods.length} listings
        </p>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading food listings from backend...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="empty-results">
            <h3>No food listings found</h3>
            <p>Try another search keyword or switch status filters.</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => {
              const pickup = getPickupInfo(food.deadline);
              const isClaimed = food.status === "Claimed";
              const isExpired = pickup.label === "Expired";
              const isClaimingThis = claimingId === food.id;

              const formattedDeadline = food.deadline
                ? new Date(food.deadline).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Not specified";

              return (
                <article className="food-card" key={food.id}>
                  <div className="food-card-content">
                    <h3>{food.name}</h3>

                    <p>
                      <strong>Quantity:</strong>{" "}
                      {food.quantity && food.quantity.toLowerCase().includes("meal")
                        ? food.quantity
                        : `${food.quantity} meals`}
                    </p>

                    <p>
                      <strong>Location:</strong> {food.location}
                    </p>

                    <p>
                      <strong>Donor:</strong> {food.donor}
                    </p>

                    <p>
                      <strong>Pickup deadline:</strong> {formattedDeadline}
                    </p>

                    <span className={`pickup-badge ${pickup.className}`}>
                      {pickup.label}
                    </span>

                    <p className="listing-status">
                      Status: <strong>{food.status}</strong>
                    </p>

                    {isClaimed && food.claimedBy && (
                      <div className="claim-history-info">
                        <strong>Claimed by:</strong> {food.claimedBy}
                        {food.claimedByRole ? ` (${food.claimedByRole})` : ''}
                        {food.claimedAt ? ` on ${new Date(food.claimedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={
                        isClaimed ||
                        isExpired ||
                        pickup.label === "Deadline not set" ||
                        isClaimingThis
                      }
                      onClick={() => onClaim(food)}
                    >
                      {isClaimingThis
                        ? "Claiming..."
                        : isClaimed
                        ? "Already Claimed"
                        : isExpired
                        ? "Pickup Expired"
                        : "Claim Food"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function DonateFoodPage({ onNavigate, onAddFood, currentUser, onOpenAuth, onLogout }) {
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')
  const [donor, setDonor] = useState(currentUser ? currentUser.organization || currentUser.name : '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [minDateTime] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    try {
      await onAddFood({
        name: foodName.trim(),
        quantity: `${quantity} meals`,
        location: location.trim(),
        deadline,
        donor: donor.trim(),
        status: 'Available',
      })
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit food donation.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        onNavigate={onNavigate}
        currentPage="donate"
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      <main className="app-page donate-page">
        <p className="app-eyebrow">MAKE A DIFFERENCE</p>
        <h1>Share food. Share hope.</h1>
        <p className="page-description">
          Have surplus food? Add a listing to help connect it
          with people and organizations who can collect it.
        </p>

        {submitError && (
          <div className="alert-banner alert-error">
            <span>{submitError}</span>
          </div>
        )}

        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>Food donation details</h2>
            <p>Enter the information about your available food.</p>
          </div>

          <label htmlFor="foodName">Food name</label>
          <input
            id="foodName"
            type="text"
            placeholder="e.g. Vegetable rice and curry"
            value={foodName}
            onChange={(event) => setFoodName(event.target.value)}
            disabled={submitting}
            required
          />

          <label htmlFor="donor">Donor name</label>
          <input
            id="donor"
            type="text"
            placeholder="Restaurant or organization name"
            value={donor}
            onChange={(event) => setDonor(event.target.value)}
            disabled={submitting}
            required
          />

          <label htmlFor="quantity">Quantity (number of meals)</label>
          <input
            id="quantity"
            type="number"
            min="1"
            placeholder="e.g. 25"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={submitting}
            required
          />

          <label htmlFor="location">Pickup location</label>
          <input
            id="location"
            type="text"
            placeholder="Enter the pickup address or area"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            disabled={submitting}
            required
          />

          <label htmlFor="deadline">Pickup deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            min={minDateTime}
            disabled={submitting}
            required
          />

          <button
            className="app-primary-button submit-donation"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Publishing food listing...' : 'Publish food listing →'}
          </button>

          <p className="form-note">
            Only list food that is safe to distribute and handle appropriately.
          </p>
        </form>
      </main>
    </>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [claimingId, setClaimingId] = useState(null)
  const [bannerMessage, setBannerMessage] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('urgency')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shareplate_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const loadFoods = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFoods({ sortBy })
      setFoods(data)
    } catch (err) {
      setError(err.message || 'Could not connect to backend server.')
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    let isMounted = true
    fetchFoods({ sortBy })
      .then((data) => {
        if (isMounted) {
          setFoods(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Could not connect to backend server.')
          setLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [sortBy])

  function handleLoginSuccess(user) {
    setCurrentUser(user)
    try {
      localStorage.setItem('shareplate_user', JSON.stringify(user))
    } catch {
      // ignore
    }
    setBannerMessage(`Welcome back, ${user.name}! (${user.role})`)
  }

  function handleLogout() {
    setCurrentUser(null)
    try {
      localStorage.removeItem('shareplate_user')
    } catch {
      // ignore
    }
    setBannerMessage('Logged out successfully.')
  }

  async function handleAddFood(newFoodData) {
    const createdFood = await createFood(newFoodData)
    setFoods((currentFoods) => [createdFood, ...currentFoods])
    setBannerMessage(`Listing for "${createdFood.name}" published successfully!`)
    setPage('find')
  }

  async function handleClaim(food) {
    // Check authentication
    if (!currentUser) {
      setError('Please log in as an NGO or Volunteer to claim food donations.')
      setAuthModalOpen(true)
      return
    }

    if (currentUser.role === 'DONOR') {
      setError('Donors cannot claim food. Please log in as an NGO or Volunteer.')
      return
    }

    setClaimingId(food.id)
    setError(null)
    try {
      const claimantInfo = {
        claimedBy: currentUser.organization || currentUser.name,
        claimedByRole: currentUser.role,
      }
      const updated = await claimFoodApi(food.id, claimantInfo)
      setFoods((currentFoods) =>
        currentFoods.map((f) => (f.id === food.id ? updated : f))
      )
      setBannerMessage(`Successfully claimed "${updated.name}" for ${claimantInfo.claimedBy}!`)
    } catch (err) {
      setError(err.message || 'Failed to claim food.')
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {page === 'home' && (
        <HomePage
          onNavigate={setPage}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {page === 'donate' && (
        <DonateFoodPage
          onNavigate={setPage}
          onAddFood={handleAddFood}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {page === 'find' && (
        <FindFoodPage
          foods={foods}
          onNavigate={setPage}
          onClaim={handleClaim}
          loading={loading}
          error={error}
          onRetry={loadFoods}
          claimingId={claimingId}
          bannerMessage={bannerMessage}
          onCloseBanner={() => setBannerMessage(null)}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}
    </>
  )
}

export default App
