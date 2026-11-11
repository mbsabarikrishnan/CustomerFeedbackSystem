import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/feedback";

function App() {
  const [page, setPage] = useState("form");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ask the backend for saved feedback when the Manager page opens.
  async function loadFeedback() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load feedback.");
      setFeedbackList(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (page === "manager") loadFeedback();
  }, [page]);

  // Send valid form data to Express. Express saves it in MongoDB.
  async function submitFeedback(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!name.trim() || !mobile.trim() || !comment.trim() || rating === 0) {
      setError("Please complete all fields and choose a star rating.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          rating,
          comment: comment.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Feedback could not be submitted.");

      setName("");
      setMobile("");
      setRating(0);
      setComment("");
      setSuccess("Thank you! Your feedback was submitted successfully.");
    } catch (err) {
      setError(err.message || "Unable to connect to the server. Please try again.");
    }
  }

  function showForm() {
    setPage("form");
    setError("");
  }

  function showManager() {
    setPage("manager");
    setSuccess("");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">★</div>
          <div><h1>CarePoint</h1><p>Customer experience portal</p></div>
        </div>
        <nav>
          <button className={page === "form" ? "nav-button active" : "nav-button"} onClick={showForm}>Feedback Form</button>
          <button className={page === "manager" ? "nav-button active" : "nav-button"} onClick={showManager}>Manager Page</button>
        </nav>
      </header>

      {page === "form" ? (
        <main className="form-layout">
          <section className="intro">
            <p className="eyebrow">WE VALUE YOUR VOICE</p>
            <h2>Your experience<br /><span>matters to us.</span></h2>
            <p className="intro-copy">Tell us how we did. Your feedback helps us make every visit better.</p>
            <p className="thank-you">♥ &nbsp;Thank you for helping us improve</p>
          </section>

          <section className="form-card">
            <div className="card-heading">
              <div><p className="eyebrow">CUSTOMER SURVEY</p><h2>Share your feedback</h2></div>
              <div className="card-icon">✎</div>
            </div>

            <form onSubmit={submitFeedback}>
              <label htmlFor="customer-name">Customer Name</label>
              <input id="customer-name" type="text" placeholder="Enter your full name"
                value={name} onChange={(event) => setName(event.target.value)} />

              <label htmlFor="mobile">Mobile Number</label>
              <input id="mobile" type="tel" inputMode="numeric" maxLength="10"
                placeholder="10-digit mobile number" value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))} />

              <label>Star Rating</label>
              <div className="stars" aria-label="Select a rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star}
                    className={star <= rating ? "star selected" : "star"}
                    onClick={() => setRating(star)} aria-label={`${star} star${star > 1 ? "s" : ""}`}>★</button>
                ))}
                <span className="rating-label">{rating === 0 ? "Select a rating" : `${rating} out of 5`}</span>
              </div>

              <label htmlFor="comment">Your Feedback</label>
              <textarea id="comment" rows="4" placeholder="Tell us about your experience..."
                value={comment} onChange={(event) => setComment(event.target.value)} />

              {error && <p className="alert error">{error}</p>}
              {success && <p className="alert success">{success}</p>}
              <button className="submit-button" type="submit">Submit Feedback <span>→</span></button>
              <p className="privacy-note">Your feedback is valuable and will be reviewed by our team.</p>
            </form>
          </section>
        </main>
      ) : (
        <main className="manager-layout">
          <div className="manager-heading">
            <div><p className="eyebrow">ADMINISTRATION</p><h2>Customer Feedback</h2>
              <p>Review ratings and comments shared by your customers.</p></div>
            <div className="total-card"><span>Total responses</span><strong>{feedbackList.length}</strong></div>
          </div>

          {loading ? <div className="empty-card">Loading feedback...</div> :
            error ? <div className="alert error">{error}</div> :
            feedbackList.length === 0 ? (
              <div className="empty-card">
                <div className="empty-icon">☆</div><h3>No feedback yet</h3>
                <p>Submitted customer feedback will appear here.</p>
                <button className="submit-button small" onClick={showForm}>Go to Feedback Form</button>
              </div>
            ) : (
              <div className="feedback-grid">
                {feedbackList.map((item) => (
                  <article className="feedback-card" key={item._id}>
                    <div className="feedback-top">
                      <div className="avatar">{item.name.charAt(0).toUpperCase()}</div>
                      <div className="customer-info"><h3>{item.name}</h3><p>{item.mobile}</p></div>
                      <span className="rating-pill">★ {item.rating}/5</span>
                    </div>
                    <div className="manager-stars">{"★".repeat(item.rating)}<span>{"★".repeat(5 - item.rating)}</span></div>
                    <p className="comment">{item.comment}</p>
                    <p className="date">{new Date(item.createdAt).toLocaleString()}</p>
                  </article>
                ))}
              </div>
            )}
        </main>
      )}
      <footer>© 2026 CarePoint · Customer Feedback Management</footer>
    </div>
  );
}

export default App;
