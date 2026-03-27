import { Component } from "react";
import ServerError from "../pages/errors/ServerError";
import { saveErrorContext } from "../utils/errorReporter";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep console logging for local debugging and future monitoring hooks.
    console.error("Unhandled UI error:", error, errorInfo);
    saveErrorContext({
      source: "UI",
      message: error?.message || "Unhandled UI error",
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      path: window.location.pathname
    });
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }

    return this.props.children;
  }
}
