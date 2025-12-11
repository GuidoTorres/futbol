import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react-native';
import { colors, spacing, typography } from '../styles/theme';
import Button from '../components/ui/Button';

export default function NotFoundScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada', headerShown: false }} />
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <AlertCircle size={80} color={colors.primary} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.title}>Página no encontrada</Text>
          <Text style={styles.message}>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              onPress={() => router.push('/')}
              style={styles.button}
            >
              Ir al inicio
            </Button>
            
            <Button
              variant="outline"
              onPress={() => router.back()}
              style={styles.button}
            >
              Volver atrás
            </Button>
          </View>

          <Text style={styles.helpText}>
            Si crees que esto es un error, por favor contacta con soporte.
          </Text>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
