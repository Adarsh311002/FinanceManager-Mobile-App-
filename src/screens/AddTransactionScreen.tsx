import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'; 
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, TransactionType } from '../store/useStore';
import { lightTheme, darkTheme } from '../theme/colors';

const CATEGORIES = [
  'Food',
  'Transport',
  'Salary',
  'Entertainment',
  'Bills',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F43F5E',
  Transport: '#3B82F6',
  Salary: '#57C9A4',
  Entertainment: '#8B5CF6',
  Bills: '#F59E0B',
  Other: '#E8C6A5',
};

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode, addTransaction } = useStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(null), 3000); 
  };

  const handleSave = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!category) {
      showError('Please select a category.');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    addTransaction({
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      date: formattedDate,
      note,
      type,
    });

    setAmount('');
    setNote('');
    setDate(new Date());
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : insets.top + 20}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          New Transaction
        </Text>
      </View>

      {errorMsg && (
        <Animated.View
          entering={FadeInDown.springify()}
          exiting={FadeOutUp.springify()}
          style={styles.errorToast}
        >
          <Icon name="warning" size={20} color="#FFF" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.toggleContainer, { backgroundColor: theme.card }]}
        >
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              type === 'income' && { backgroundColor: theme.success },
            ]}
            onPress={() => setType('income')}
          >
            <Text
              style={[
                styles.toggleText,
                type === 'income' && styles.activeToggleText,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              type === 'expense' && { backgroundColor: theme.danger },
            ]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[
                styles.toggleText,
                type === 'expense' && styles.activeToggleText,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.amountWrapper}
        >
          <Text style={[styles.currencySymbol, { color: theme.textSecondary }]}>
            ₹
          </Text>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.border}
            value={amount}
            onChangeText={setAmount}
            maxLength={8}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Category
          </Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map(cat => {
              const isSelected = category === cat;
              const catColor = CATEGORY_COLORS[cat];
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    isSelected && {
                      backgroundColor: catColor + '20',
                      borderColor: catColor,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <View
                    style={[
                      styles.chipIndicator,
                      { backgroundColor: catColor },
                    ]}
                  />
                  <Text
                    style={{
                      color: isSelected ? catColor : theme.text,
                      fontWeight: isSelected ? '700' : '500',
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Date
          </Text>
          <TouchableOpacity
            style={[
              styles.inputBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon
              name="calendar-outline"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <Text style={{ color: theme.text, fontSize: 16 }}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Note (Optional)
          </Text>
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                alignItems: 'flex-start',
                paddingVertical: 12,
              },
            ]}
          >
            <Icon
              name="document-text-outline"
              size={20}
              color={theme.textSecondary}
              style={[styles.inputIcon, { marginTop: 2 }]}
            />
            <TextInput
              style={[styles.noteInput, { color: theme.text }]}
              placeholder="What was this for?"
              placeholderTextColor={theme.textSecondary}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            style={styles.saveBtnWrapper}
          >
            <LinearGradient
              colors={['#57C9A4', '#34D399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.saveBtnText}>Save Transaction</Text>
              <Icon
                name="checkmark-circle"
                size={24}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  scrollContainer: { paddingHorizontal: 20, flexGrow: 1 },

  errorToast: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  errorText: { color: '#FFF', fontWeight: '600', fontSize: 14, flex: 1 },

  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleText: { fontSize: 16, fontWeight: '700', color: '#A1A1AA' },
  activeToggleText: { color: '#FFF' },

  amountWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '600',
    marginRight: 8,
    marginTop: -6,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
  },

  label: { fontSize: 14, fontWeight: '600', marginBottom: 12, marginTop: 10 },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  noteInput: { flex: 1, fontSize: 16, minHeight: 60, textAlignVertical: 'top' },

  saveBtnWrapper: {
    marginTop: 20,
    shadowColor: '#57C9A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
