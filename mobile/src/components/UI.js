import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../theme';

export function Screen({ children, scroll = true }) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fixedContent}>{children}</View>
  );

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

export function HeroCard({ children }) {
  return (
    <LinearGradient colors={['#FFF9F5', '#F4E8DA']} style={styles.heroCard}>
      {children}
    </LinearGradient>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Input(props) {
  return <TextInput placeholderTextColor={theme.colors.muted} style={styles.input} {...props} />;
}

export function PrimaryButton({ label, onPress, disabled, loading, style }) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled || loading ? styles.buttonDisabled : null,
        pressed ? styles.buttonPressed : null,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.buttonText}>{label}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.secondaryButton, style]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 18,
    gap: 16,
  },
  fixedContent: {
    flex: 1,
    padding: 18,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 18,
  },
  heroCard: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    color: theme.colors.text,
    fontSize: 16,
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
