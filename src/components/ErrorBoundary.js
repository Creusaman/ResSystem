import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong. Please try again later.</p>
          <button onClick={this.retry}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
