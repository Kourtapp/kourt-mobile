import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { logger } from '../utils/logger';

interface Props {
    children: ReactNode;
    /** Optional fallback component */
    fallback?: ReactNode;
    /** Optional callback when error occurs */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('[ErrorBoundary] Uncaught error:', { error, errorInfo });
        this.props.onError?.(error, errorInfo);

        // Send to Sentry
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <SafeAreaView
                    style={styles.container}
                    accessible={true}
                    accessibilityRole="alert"
                    accessibilityLabel="Erro no aplicativo"
                >
                    <View style={styles.content}>
                        <MaterialIcons
                            name="error-outline"
                            size={64}
                            color="#EF4444"
                            accessibilityElementsHidden={true}
                        />
                        <Text
                            style={styles.title}
                            accessibilityRole="header"
                        >
                            Ops! Algo deu errado.
                        </Text>
                        <Text style={styles.message}>
                            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
                        </Text>
                        <Pressable
                            onPress={this.handleReset}
                            style={styles.button}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Tentar novamente"
                            accessibilityHint="Toca para recarregar a tela"
                        >
                            <Text style={styles.buttonText}>Tentar Novamente</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 16,
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
