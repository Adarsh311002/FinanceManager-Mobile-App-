import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { lightTheme, darkTheme } from '../theme/colors';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();

  const { isDarkMode, setTheme, setUserName } = useStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const isAndroid15Plus =
    Platform.OS === 'android' && Number(Platform.Version) >= 35;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleContinue = () => {
    if (name.trim().length > 0) {
      setUserName(name.trim());
    }
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const wrapperProps =
    Platform.OS === 'ios'
      ? {
          behavior: 'padding' as const,
          style: { flex: 1, backgroundColor: theme.background },
        }
      : {
          style: {
            flex: 1,
            backgroundColor: theme.background,
            paddingBottom: isAndroid15Plus ? keyboardHeight + 20 : 0,            
          },
        };

  const footerPaddingBottom =
    keyboardHeight > 0 ? 10 : Math.max(insets.bottom + 10, 20);

  return (
    <Wrapper {...wrapperProps}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.View
            entering={FadeInDown.duration(800).springify()}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={['#E8C6A5', '#57C9A4']}
              style={styles.iconBg}
            >
              <Icon name="rocket" size={48} color="#FFF" />
            </LinearGradient>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(800).springify()}
          >
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome to FinanceCore
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Let's personalize your experience. What should we call you?
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            style={styles.inputWrapper}
          >
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Icon
                name="person-outline"
                size={24}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your first name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                maxLength={15}
              />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(500).duration(800).springify()}
          >
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Choose your theme
            </Text>
            <View style={styles.themeRow}>
              <TouchableOpacity
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: !isDarkMode ? '#57C9A4' : theme.border,
                  },
                ]}
                onPress={() => setTheme(false)}
                activeOpacity={0.8}
              >
                <Icon
                  name="sunny"
                  size={24}
                  color={!isDarkMode ? '#57C9A4' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.themeText,
                    {
                      color: !isDarkMode ? '#57C9A4' : theme.textSecondary,
                      fontWeight: !isDarkMode ? 'bold' : '600',
                    },
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: isDarkMode ? '#57C9A4' : theme.border,
                  },
                ]}
                onPress={() => setTheme(true)}
                activeOpacity={0.8}
              >
                <Icon
                  name="moon"
                  size={20}
                  color={isDarkMode ? '#57C9A4' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.themeText,
                    {
                      color: isDarkMode ? '#57C9A4' : theme.textSecondary,
                      fontWeight: isDarkMode ? 'bold' : '600',
                    },
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(600).duration(800).springify()}
        style={[
          styles.footer,
          {
            paddingBottom: footerPaddingBottom,
            backgroundColor: theme.background,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={name.trim().length === 0}
        >
          <LinearGradient
            colors={
              name.trim().length > 0
                ? ['#E8C6A5', '#57C9A4']
                : [theme.card, theme.card]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              name.trim().length === 0 && {
                borderWidth: 1,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    name.trim().length > 0 ? '#111827' : theme.textSecondary,
                },
              ]}
            >
              Let's Get Started
            </Text>
            <Icon
              name="arrow-forward"
              size={20}
              color={name.trim().length > 0 ? '#111827' : theme.textSecondary}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  iconContainer: { alignItems: 'center', marginBottom: 40 },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#57C9A4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputWrapper: { marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 64,
    borderWidth: 1,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 18, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 12, marginLeft: 4 },
  themeRow: { flexDirection: 'row', gap: 16 },
  themeCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  themeText: { fontSize: 16 },

  footer: { paddingHorizontal: 30, paddingTop: 10 },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 16,
    gap: 10,
  },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});
