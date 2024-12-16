// ErrorBoundary.jsx  

import React from 'react';  

class ErrorBoundary extends React.Component {  
  constructor(props) {  
    super(props);  
    this.state = { hasError: false };  
  }  

  static getDerivedStateFromError(error) {  
    // Update state to show fallback UI  
    return { hasError: true };  
  }  

  componentDidCatch(error, errorInfo) {  
    // Log the error to an error reporting service, if desired  
    console.error("Error caught by ErrorBoundary:", error, errorInfo);  
  }  

  render() {  
    if (this.state.hasError) {  
      return <h1>Something went wrong. Please try again later.</h1>; // Fallback UI  
    }  

    return this.props.children; // Render children if no error  
  }  
}  

export default ErrorBoundary;