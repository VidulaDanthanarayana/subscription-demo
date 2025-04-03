import './inline-styles.css';

export default function InlineStyles() {
  return (
    <div className="test-container">
      <div className="test-card">
        <h1 className="test-title">Inline CSS Test</h1>
        <p className="test-text">
          This is a test component to verify if regular CSS is working properly.
        </p>
        <div className="test-grid">
          <div className="test-box test-box-red">Red</div>
          <div className="test-box test-box-green">Green</div>
          <div className="test-box test-box-blue">Blue</div>
          <div className="test-box test-box-yellow">Yellow</div>
        </div>
        <button className="test-button">
          Test Button
        </button>
      </div>
    </div>
  );
} 