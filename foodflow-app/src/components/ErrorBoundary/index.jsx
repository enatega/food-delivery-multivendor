// components/ErrorBoundary.js
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log('ErrorBoundary caught an error', error, info);
    // Optionally log to a service like Sentry
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>

          <TouchableOpacity onPress={this.handleReset} style={styles.button}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#E4644B', // coral red or any theme color
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
